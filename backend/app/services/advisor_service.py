import json
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from app.models.startup import Startup, Analysis, AgentResult, Debate
from app.rag.engine import rag_engine
from app.agents.extractor import extract_startup_context
from app.agents.advisors import run_advisor_agent
from app.agents.debate import run_multi_agent_debate
from app.agents.synthesis import run_synthesis_agent

class AdvisorCoordinatorService:
    @staticmethod
    def generate_default_finances(context: Dict[str, Any]) -> Dict[str, Any]:
        title = context.get("title", "This Venture")
        industry = context.get("industry", "Technology")
        stage = context.get("stage", "Idea")

        return {
            "launch_budget": "₹1,50,000 - ₹3,00,000 ($1,800 - $3,600)",
            "launch_budget_items": [
                { "item": "App / Website Prototype", "cost": "₹60,000 - ₹1,20,000", "explanation": "Building simple first working version with core features" },
                { "item": "Cloud Hosting & AI Usage", "cost": "₹15,000 - ₹30,000", "explanation": "Server databases, AI model queries, and domain setup" },
                { "item": "Company Registration & Privacy Terms", "cost": "₹15,000 - ₹25,000", "explanation": "Simple Private Limited setup and user agreement" },
                { "item": "First 100 User Testing & Marketing", "cost": "₹40,000 - ₹75,000", "explanation": "Direct outreach to acquire first real users" }
            ],
            "monthly_running_cost": "₹15,000 - ₹35,000 / month ($180 - $420/mo)",
            "monthly_cost_items": [
                { "item": "Cloud Hosting & Database", "cost": "₹5,000 - ₹10,000/mo", "explanation": "Keeping the app online and fast" },
                { "item": "AI API Processing Fees", "cost": "₹5,000 - ₹15,000/mo", "explanation": "Cost paid per user AI diagnostic query" },
                { "item": "Maintenance & User Support", "cost": "₹5,000 - ₹10,000/mo", "explanation": "Fixing bugs and helping users" }
            ],
            "pricing_recommendation": "₹499 - ₹999 per month (or ₹4,999/year)",
            "cost_per_user": "₹30 - ₹60 per active user / month",
            "estimated_valuation": "₹30,00,000 - ₹60,00,000 ($35,000 - $70,000)",
            "three_year_potential_worth": "₹2.5 Crore - ₹6 Crore ($300k - $750k)",
            "break_even_timeline": "6 to 9 Months with 150 paying users",
            "fundraising_goal": "Apply for ₹20 Lakhs Government Seed Grant (SISFS)",
            "plain_english_advice": "Start small with a working prototype. Keep your monthly costs under ₹25,000 until you have at least 50 happy paying users."
        }

    @staticmethod
    def analyze_startup(
        db: Session,
        raw_idea: str,
        stage: str = "Just an Idea",
        user_title: Optional[str] = None
    ) -> Analysis:
        # Step 1: Create initial startup record
        initial_title = user_title.strip() if user_title and user_title.strip() else "New Startup"
        startup = Startup(
            title=initial_title,
            raw_idea=raw_idea.strip(),
            stage=stage or "Just an Idea"
        )
        db.add(startup)
        db.commit()
        db.refresh(startup)

        # Step 2: RAG Retrieval against policy corpus
        rag_query = f"{user_title or raw_idea[:60]} {raw_idea[:200]}"
        rag_sources = rag_engine.search(rag_query, top_k=4)

        # Step 3: Run High-Speed Unified Board Convening
        advisor_keys = [
            ("investor", "Investor Agent", "Venture Capitalist & Angel Investor"),
            ("lender", "Lender Agent", "Commercial Lender & Credit Risk Officer"),
            ("strategist", "Business Strategist", "Chief Business Strategist"),
            ("legal", "Legal Advisor", "Startup Corporate & Regulatory Counsel"),
            ("customer", "Customer Advocate", "Customer Advocate & Product Experience Director"),
            ("devil", "Devil's Advocate", "Devil's Advocate & Risk Inquisitor")
        ]

        from app.agents.unified import run_unified_advisory_board
        from app.agents.advisors import _generate_advisor_fallback
        from app.agents.debate import _generate_fallback_debate
        from app.agents.synthesis import _generate_fallback_synthesis

        unified_data = run_unified_advisory_board(raw_idea, stage, user_title, rag_sources)

        if unified_data:
            extracted_context = unified_data.get("context", {})
            if not extracted_context.get("title"):
                extracted_context["title"] = startup.title
            agent_results_map = unified_data.get("advisors", {})
            # Ensure every advisor key exists in results map
            for ak, an, ar in advisor_keys:
                if ak not in agent_results_map:
                    agent_results_map[ak] = _generate_advisor_fallback(ak, extracted_context, rag_sources)
            debate_output = unified_data.get("debate", {})
            if not debate_output or not debate_output.get("turns"):
                debate_output = _generate_fallback_debate(extracted_context, agent_results_map)
            
            # Map synthesis fields
            v_scores = unified_data.get("viability_scores", {})
            swot = unified_data.get("swot_analysis", {})
            synthesis_output = {
                "viability_score": v_scores.get("viability_score", 72),
                "market_potential_score": v_scores.get("market_potential_score", 75),
                "business_model_score": v_scores.get("business_model_score", 74),
                "financial_feasibility_score": v_scores.get("financial_feasibility_score", 68),
                "risk_level": v_scores.get("risk_level", "Moderate"),
                "strengths": swot.get("strengths", []),
                "weaknesses": swot.get("weaknesses", []),
                "opportunities": swot.get("opportunities", []),
                "risks": swot.get("risks", []),
                "risk_matrix": unified_data.get("risk_matrix", []),
                "action_plan": unified_data.get("action_plan", {}),
                "synthesis": unified_data.get("synthesis", "")
            }
            finances_data = unified_data.get("finances")
            if not finances_data:
                finances_data = AdvisorCoordinatorService.generate_default_finances(extracted_context)
        else:
            # Fallback path if Groq is offline or rate-limited
            extracted_context = extract_startup_context(raw_idea, stage, user_title)
            agent_results_map = {k: _generate_advisor_fallback(k, extracted_context, rag_sources) for k, _, _ in advisor_keys}
            debate_output = _generate_fallback_debate(extracted_context, agent_results_map)
            scores = [res.get("score", 70) for res in agent_results_map.values() if isinstance(res, dict) and "score" in res]
            avg_score = round(sum(scores) / len(scores)) if scores else 74
            synthesis_output = _generate_fallback_synthesis(extracted_context, agent_results_map, debate_output, avg_score)
            finances_data = AdvisorCoordinatorService.generate_default_finances(extracted_context)

        # Update startup title & extracted context
        startup.title = extracted_context.get("title", startup.title)
        startup.extracted_context = json.dumps(extracted_context)
        db.commit()
        db.refresh(startup)

        # Step 7: Persist Analysis Record with finances
        analysis = Analysis(
            startup_id=startup.id,
            viability_score=synthesis_output.get("viability_score", 75),
            market_potential_score=synthesis_output.get("market_potential_score", 80),
            business_model_score=synthesis_output.get("business_model_score", 78),
            financial_feasibility_score=synthesis_output.get("financial_feasibility_score", 70),
            risk_level=synthesis_output.get("risk_level", "Moderate"),
            strengths=json.dumps(synthesis_output.get("strengths", [])),
            weaknesses=json.dumps(synthesis_output.get("weaknesses", [])),
            opportunities=json.dumps(synthesis_output.get("opportunities", [])),
            risks=json.dumps(synthesis_output.get("risks", [])),
            risk_matrix=json.dumps(synthesis_output.get("risk_matrix", [])),
            action_plan=json.dumps(synthesis_output.get("action_plan", {})),
            synthesis=synthesis_output.get("synthesis", ""),
            rag_sources=json.dumps(rag_sources),
            finances=json.dumps(finances_data)
        )
        db.add(analysis)
        db.commit()
        db.refresh(analysis)

        # Step 8: Persist Agent Results
        for key, name, role in advisor_keys:
            res = agent_results_map.get(key, {})
            ar_record = AgentResult(
                analysis_id=analysis.id,
                agent_name=name,
                role_title=role,
                result=json.dumps(res)
            )
            db.add(ar_record)

        # Step 9: Persist Debate
        debate_record = Debate(
            analysis_id=analysis.id,
            debate_content=json.dumps(debate_output.get("turns", [])),
            synthesis=json.dumps(debate_output.get("synthesis", {}))
        )
        db.add(debate_record)

        db.commit()
        db.refresh(analysis)
        return analysis

    @staticmethod
    def format_analysis_response(analysis: Analysis) -> Dict[str, Any]:
        startup = analysis.startup
        context = startup.get_context_dict() if hasattr(startup, 'get_context_dict') else {}

        finances_data = {}
        if hasattr(analysis, "finances") and analysis.finances:
            try:
                finances_data = json.loads(analysis.finances)
            except Exception:
                finances_data = {}
        
        if not finances_data:
            finances_data = AdvisorCoordinatorService.generate_default_finances(context)

        return {
            "id": analysis.id,
            "startup_id": startup.id,
            "startup_title": startup.title,
            "raw_idea": startup.raw_idea,
            "extracted_context": context,
            "viability_score": analysis.viability_score,
            "market_potential_score": analysis.market_potential_score,
            "business_model_score": analysis.business_model_score,
            "financial_feasibility_score": analysis.financial_feasibility_score,
            "risk_level": analysis.risk_level,
            "strengths": json.loads(analysis.strengths) if analysis.strengths else [],
            "weaknesses": json.loads(analysis.weaknesses) if analysis.weaknesses else [],
            "opportunities": json.loads(analysis.opportunities) if analysis.opportunities else [],
            "risks": json.loads(analysis.risks) if analysis.risks else [],
            "risk_matrix": json.loads(analysis.risk_matrix) if analysis.risk_matrix else [],
            "action_plan": json.loads(analysis.action_plan) if analysis.action_plan else {},
            "synthesis": analysis.synthesis,
            "rag_sources": json.loads(analysis.rag_sources) if analysis.rag_sources else [],
            "finances": finances_data,
            "created_at": analysis.created_at
        }
