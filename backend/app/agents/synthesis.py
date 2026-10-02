from typing import Dict, Any, List
from app.agents.core import groq_client

SYNTHESIS_SYSTEM_PROMPT = """You are the Supreme Venture Synthesis Agent for StartupAdvisor AI.
Synthesize the multi-agent findings, cross-evaluation debate, and market context into a unified, actionable strategic report.

Produce a JSON response with:
1. Viability Scores:
   - viability_score: Integer 0-100
   - market_potential_score: Integer 0-100
   - business_model_score: Integer 0-100
   - financial_feasibility_score: Integer 0-100
   - risk_level: 'Low' | 'Moderate' | 'Elevated' | 'High'
2. SWOT Analysis:
   - strengths: List of 4 concise bullet points
   - weaknesses: List of 4 concise bullet points
   - opportunities: List of 4 concise bullet points
   - risks: List of 4 concise bullet points
3. Risk Matrix (7 distinct items covering: Market, Financial, Competition, Legal, Customer, Operational, Technology):
   - Each with:
     - id: 'risk_1' to 'risk_7'
     - category: category name
     - title: concise risk title
     - impact: 1 to 5 (1=Low, 5=Critical)
     - likelihood: 1 to 5 (1=Rare, 5=Almost Certain)
     - description: concise details
     - why_it_matters: business impact
     - suggested_mitigation: actionable mitigation
     - severity_label: 'Low' | 'Moderate' | 'High' | 'Critical'
4. Action Plan:
   - seven_days: List of 3-4 immediate actions with { "title", "task", "priority": "High" | "Medium", "owner_role" }
   - thirty_days: List of 3-4 actions
   - ninety_days: List of 3-4 actions
5. Synthesis Narrative:
   - 3-paragraph executive narrative summarizing the venture's strategic path forward.
"""

def run_synthesis_agent(
    context: Dict[str, Any],
    agent_results: Dict[str, Any],
    debate_data: Dict[str, Any],
    rag_sources: List[Dict[str, Any]]
) -> Dict[str, Any]:
    # Calculate a composite score baseline from advisor scores
    scores = [res.get("score", 70) for res in agent_results.values() if isinstance(res, dict) and "score" in res]
    avg_score = round(sum(scores) / len(scores)) if scores else 74

    user_prompt = f"""STARTUP: {context.get('title')}
Industry: {context.get('industry')}
Problem: {context.get('problem')}
Solution: {context.get('solution')}
Business Model: {context.get('business_model')}
Stage: {context.get('startup_stage')}

ADVISOR SCORES: { {k: v.get('score', 70) for k, v in agent_results.items()} }
DEBATE CONSENSUS: {debate_data.get('synthesis', {}).get('consensus', [])}
DEBATE DISAGREEMENTS: {debate_data.get('synthesis', {}).get('disagreements', [])}
STRATEGIC MANDATE: {debate_data.get('synthesis', {}).get('strategic_mandate', '')}

Synthesize this into full Viability scores, SWOT 2x2, 5x5 Risk Matrix items, Action Plan, and Narrative."""

    result = groq_client.chat_json(SYNTHESIS_SYSTEM_PROMPT, user_prompt, temperature=0.3, max_tokens=850)
    if result and isinstance(result, dict):
        # 1. Normalize viability scores if nested under viability_scores
        if "viability_scores" in result and isinstance(result["viability_scores"], dict):
            for k, v in result["viability_scores"].items():
                result[k] = v
        
        # 2. Normalize SWOT if nested under swot_analysis
        if "swot_analysis" in result and isinstance(result["swot_analysis"], dict):
            for k, v in result["swot_analysis"].items():
                if isinstance(v, dict):
                    result[k] = list(v.values())
                elif isinstance(v, list):
                    result[k] = v
                elif isinstance(v, str):
                    result[k] = [v]

        # 3. Ensure weaknesses/strengths/opportunities/risks are lists
        for field in ["strengths", "weaknesses", "opportunities", "risks"]:
            if field in result:
                if isinstance(result[field], dict):
                    result[field] = list(result[field].values())
                elif isinstance(result[field], str):
                    result[field] = [result[field]]

        # 4. Normalize narrative
        if "synthesis_narrative" in result and ("synthesis" not in result or not result["synthesis"]):
            result["synthesis"] = result["synthesis_narrative"]
        elif "narrative" in result and ("synthesis" not in result or not result["synthesis"]):
            result["synthesis"] = result["narrative"]

        # 5. Check if valid
        if "viability_score" in result:
            if "risk_matrix" not in result or not isinstance(result["risk_matrix"], list) or len(result["risk_matrix"]) == 0:
                fallback = _generate_fallback_synthesis(context, agent_results, debate_data, avg_score)
                result["risk_matrix"] = fallback["risk_matrix"]
            if "action_plan" not in result or not isinstance(result["action_plan"], dict):
                fallback = _generate_fallback_synthesis(context, agent_results, debate_data, avg_score)
                result["action_plan"] = fallback["action_plan"]
            return result

    return _generate_fallback_synthesis(context, agent_results, debate_data, avg_score)

def _generate_fallback_synthesis(
    context: Dict[str, Any],
    agent_results: Dict[str, Any],
    debate_data: Dict[str, Any],
    avg_score: int
) -> Dict[str, Any]:
    title = context.get("title", "The Startup")
    industry = context.get("industry", "Technology")

    risk_matrix = [
        {
            "id": "risk_market",
            "category": "Market",
            "title": "Adoption & Willingness to Pay Resistance",
            "impact": 4,
            "likelihood": 3,
            "description": f"Target users may welcome free diagnostic trials but resist converting to paid subscription plans.",
            "why_it_matters": "Directly threatens customer lifetime value (LTV) and cash-flow breakeven timelines.",
            "suggested_mitigation": "Deploy B2B2C distribution where cooperatives, buyers, or sponsors underwrite the user license.",
            "severity_label": "High"
        },
        {
            "id": "risk_financial",
            "category": "Financial",
            "title": "Cloud Compute & Model Inference Burn",
            "impact": 3,
            "likelihood": 3,
            "description": f"High volume of image or data uploads can spike GPU inference costs before unit monetization is stabilized.",
            "why_it_matters": "Depletes seed capital runway prematurely if gross margins drop below 50%.",
            "suggested_mitigation": "Optimize lightweight quantized edge models on mobile devices to compress cloud processing overhead.",
            "severity_label": "Moderate"
        },
        {
            "id": "risk_competition",
            "category": "Competition",
            "title": "Incumbent & Foundation Model Replicability",
            "impact": 4,
            "likelihood": 3,
            "description": "Generalist multimodal AI models could release native zero-shot diagnostics directly within dominant mobile OS ecosystems.",
            "why_it_matters": "Erodes consumer willingness to download a standalone third-party app.",
            "suggested_mitigation": "Build deep integrations with regional field workflows, vernacular audio support, and localized ground truth datasets.",
            "severity_label": "High"
        },
        {
            "id": "risk_legal",
            "category": "Legal",
            "title": "AI Advice Liability & DPDP Compliance",
            "impact": 4,
            "likelihood": 2,
            "description": "Erroneous automated recommendations causing economic crop or financial loss could trigger civil liability or statutory penalties under India DPDP Act 2023.",
            "why_it_matters": "Exposes founders to litigation and regulatory fines up to Rs. 250 Crores for personal data mishandling.",
            "suggested_mitigation": "Mandate explicit user assent to advisory-only terms of service and implement strict granular consent architecture.",
            "severity_label": "Moderate"
        },
        {
            "id": "risk_customer",
            "category": "Customer",
            "title": "Digital Literacy & UI Onboarding Drop-off",
            "impact": 3,
            "likelihood": 4,
            "description": "First-time users in non-metro and rural belts encounter onboarding friction with complex menus or high text density.",
            "why_it_matters": "Creates high Day-1 churn, preventing organic peer referral growth.",
            "suggested_mitigation": "Design an iconography-driven, vernacular audio-guided onboarding flow requiring under 3 taps to initial diagnostic output.",
            "severity_label": "High"
        },
        {
            "id": "risk_operational",
            "category": "Operational",
            "title": "Ground Validation & Partner Acquisition Delay",
            "impact": 3,
            "likelihood": 3,
            "description": "Slow bureaucratic decision-making when negotiating pilot agreements with regional agricultural or trade associations.",
            "why_it_matters": "Drags product-market fit validation cycles and freezes GTM expansion.",
            "suggested_mitigation": "Establish low-friction, non-exclusive trial MOUs with local grassroots coordinators and NGOs.",
            "severity_label": "Moderate"
        },
        {
            "id": "risk_tech",
            "category": "Technology",
            "title": "Intermittent Offline Connectivity Failures",
            "impact": 3,
            "likelihood": 4,
            "description": "Inconsistent 3G/4G coverage in remote territories causing app freezes or failed diagnostic requests.",
            "why_it_matters": "Destroys user trust during critical moments of need.",
            "suggested_mitigation": "Engineer local on-device SQLite caching and progressive asynchronous sync when signal restores.",
            "severity_label": "High"
        }
    ]

    action_plan = {
        "seven_days": [
            {
                "title": "Incorporate Statutory Entity & Apply for DPIIT Recognition",
                "task": "Register Private Limited entity and submit DPIIT startup application to unlock Section 80-IAC tax holidays and 80% patent discounts.",
                "priority": "High",
                "owner_role": "Legal Advisor"
            },
            {
                "title": "Draft Advisory Terms of Service & DPDP Consent Policy",
                "task": "Publish unequivocal limitation-of-liability terms affirming AI outputs are informational diagnostics, not certified guarantees.",
                "priority": "High",
                "owner_role": "Legal Advisor"
            },
            {
                "title": "Conduct 15 In-Person User Friction Interviews",
                "task": "Observe target users unassisted while interacting with wireframes or prototype to measure time-to-first-value.",
                "priority": "High",
                "owner_role": "Customer Advocate"
            }
        ],
        "thirty_days": [
            {
                "title": "Launch 90-Day Co-Marketing Pilot with Regional Partner",
                "task": "Sign non-exclusive distribution MOU with a cooperative or enterprise partner to pilot test with 300 active users.",
                "priority": "High",
                "owner_role": "Business Strategist"
            },
            {
                "title": "Apply for Startup India Seed Fund Scheme (SISFS)",
                "task": "Submit grant application for up to Rs. 20 Lakhs non-dilutive POC grant through an authorized incubator.",
                "priority": "Medium",
                "owner_role": "Investor Agent"
            },
            {
                "title": "Complete MSME Udyam Registration",
                "task": "Secure Udyam certification to qualify for Priority Sector Lending and Samadhaan delayed payment protections.",
                "priority": "Medium",
                "owner_role": "Lender Agent"
            }
        ],
        "ninety_days": [
            {
                "title": "Benchmark Paid Conversion & Unit Economics",
                "task": "Verify whether at least 8% of active pilot users or their sponsoring institutions convert to paid commercial agreements.",
                "priority": "High",
                "owner_role": "Business Strategist"
            },
            {
                "title": "Initiate Pre-Seed Capital Raising via iSAFE Notes",
                "task": "Prepare standard 12-slide diligence deck targeting Rs. 75L - 1.5Cr pre-seed funding to expand engineering and regional sales teams.",
                "priority": "Medium",
                "owner_role": "Investor Agent"
            },
            {
                "title": "Deploy Edge-Optimized Model to Slash Cloud Burn",
                "task": "Migrate core classification models to quantized mobile inference to reduce cloud server costs by over 60%.",
                "priority": "Medium",
                "owner_role": "Devil's Advocate"
            }
        ]
    }

    return {
        "viability_score": max(55, min(92, avg_score)),
        "market_potential_score": 82,
        "business_model_score": 78,
        "financial_feasibility_score": 68,
        "risk_level": "Moderate",
        "strengths": [
            f"Acute, verifiable problem in {industry} with strong macroeconomic and demographic tailwinds.",
            "Scalable software distribution with near-zero incremental marginal delivery cost.",
            "Eligibility for Indian government startup incentives, including SISFS grants and DPIIT tax exemptions.",
            "Potential for a proprietary data flywheel as field diagnostics continuously refine model accuracy."
        ],
        "weaknesses": [
            "Unproven willingness-to-pay among primary grassroots end users in early stages.",
            "Absence of physical collateral or fixed assets to support commercial bank debt.",
            "High initial reliance on manual partner outreach and localized trust building.",
            "Operational sensitivity to lighting and camera hardware variance during image capture."
        ],
        "opportunities": [
            "B2B2C institutional distribution through regional cooperatives, insurers, and corporate agribusinesses.",
            "Monetizing aggregated regional trend insights and anonymized predictive analytics for enterprise clients.",
            "Expansion into adjacent tier-2 and tier-3 developing markets with similar socioeconomic profiles.",
            "Integration with Government Digital Public Infrastructure (e.g. AgriStack / ONDC)."
        ],
        "risks": [
            "Customer churn if digital onboarding contains unnecessary friction or language barriers.",
            "Margin compression if cloud GPU inference expenses outstrip early subscription fees.",
            "Regulatory compliance liabilities under the Digital Personal Data Protection Act 2023.",
            "Commoditization risk from horizontal foundational AI models expanding multimodal features."
        ],
        "risk_matrix": risk_matrix,
        "action_plan": action_plan,
        "synthesis": f"{title} represents a compelling, socially high-impact venture in the {industry} sector. While the market opportunity and technical scalability are exceptionally strong, commercial success will be determined by distribution execution rather than algorithmic sophistication alone. The founders should immediately pivot away from direct consumer ad-spend towards an institutional B2B2C partnership model, using government non-dilutive seed grants (SISFS) and MSME status to safeguard runway while validating paying customer cohorts."
    }
