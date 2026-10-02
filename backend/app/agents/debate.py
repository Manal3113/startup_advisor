from typing import List, Dict, Any
from app.agents.core import universal_ai_client as groq_client

DEBATE_SYSTEM_PROMPT = """You are orchestrating an elite multi-agent startup boardroom debate between 6 specialized advisors:
1. Investor Agent (VC perspective: market scale, upside, defensibility)
2. Lender Agent (Credit perspective: cash flow, debt safety, working capital)
3. Business Strategist (GTM, business model, pricing, unit economics)
4. Legal Advisor (Compliance, IP, data privacy, liability)
5. Customer Advocate (User friction, empathy, adoption, retention)
6. Devil's Advocate (Red-team critique, challenging assumptions, failure modes)

CRITICAL INSTRUCTIONS:
- Each debate turn must be a SHARP, SNAPPY, 1-2 sentence clash (under 25 words per turn!).
- Eliminate all filler phrases like 'I think that' or 'As an investor, I believe'.
- Direct, adversarial cross-examination: Advisors challenge each other's specific assumptions with metrics and real-world friction.
- Provide a structured synthesis with key takeaways.

Respond ONLY with valid JSON:
{
  "turns": [
    {
      "agent_name": "Investor Agent",
      "role_title": "Venture Capitalist & Angel Investor",
      "avatar_color": "#F59E0B",
      "round_number": 1,
      "message": "Market tailwinds are massive, but venture scale requires a proprietary data flywheel to defend against foundation AI.",
      "targeted_agent": "Devil's Advocate",
      "sentiment": "challenge"
    },
    {
      "agent_name": "Devil's Advocate",
      "role_title": "Risk Inquisitor",
      "avatar_color": "#F43F5E",
      "round_number": 1,
      "message": "You're confusing free usage with paying demand. 85% of users praise free tools but abandon when paywalled.",
      "targeted_agent": "Investor Agent",
      "sentiment": "challenge"
    },
    {
      "agent_name": "Customer Advocate",
      "role_title": "Customer Voice",
      "avatar_color": "#10B981",
      "round_number": 1,
      "message": "Agreed. If onboarding takes over 30 seconds or requires complex menus, churn will be 80% on Day 1.",
      "targeted_agent": "Devil's Advocate",
      "sentiment": "agreement"
    },
    {
      "agent_name": "Business Strategist",
      "role_title": "Chief Strategist",
      "avatar_color": "#3B82F6",
      "round_number": 2,
      "message": "Then don't sell direct to users. Partner with cooperatives and enterprise sponsors who absorb the license fee.",
      "targeted_agent": "Customer Advocate",
      "sentiment": "defense"
    },
    {
      "agent_name": "Lender Agent",
      "role_title": "Credit Officer",
      "avatar_color": "#14B8A6",
      "round_number": 2,
      "message": "B2B2C is sound, but bank loans are off-limits until invoices show 6 months of predictable cash deposits.",
      "targeted_agent": "Business Strategist",
      "sentiment": "challenge"
    },
    {
      "agent_name": "Legal Advisor",
      "role_title": "Corporate Counsel",
      "avatar_color": "#8B5CF6",
      "round_number": 2,
      "message": "Before launching pilots, embed strict DPDP consent workflows and unequivocal diagnostic liability disclaimers.",
      "targeted_agent": "Business Strategist",
      "sentiment": "defense"
    }
  ],
  "synthesis": {
    "consensus": ["Point 1", "Point 2"],
    "disagreements": ["Tension 1", "Tension 2"],
    "critical_assumptions": ["Assumption 1", "Assumption 2"],
    "key_risks": ["Risk 1", "Risk 2"],
    "strategic_mandate": "A decisive 1-2 sentence overarching mandate for the founder."
  }
}
"""

def run_multi_agent_debate(context: Dict[str, Any], agent_results: Dict[str, Dict[str, Any]]) -> Dict[str, Any]:
    agent_summaries = []
    for key, res in agent_results.items():
        agent_summaries.append(f"[{key.upper()}]: Verdict: {res.get('verdict', res.get('summary', ''))[:80]} | Risk: {res.get('concerns', ['None'])[0]}")

    user_prompt = f"""STARTUP: {context.get('title')} ({context.get('industry')})
Problem: {context.get('problem')}
Solution: {context.get('solution')}
Business Model: {context.get('business_model')}

ADVISOR PERSPECTIVES:
{chr(10).join(agent_summaries)}

Orchestrate a sharp, snappy 6-turn cross-examination debate with crisp 1-2 sentence clashes, followed by a synthesis."""

    result = groq_client.chat_json(DEBATE_SYSTEM_PROMPT, user_prompt, temperature=0.4, max_tokens=650)
    if result and isinstance(result, dict) and "turns" in result and "synthesis" in result:
        return result

    return _generate_fallback_debate(context, agent_results)

def _generate_fallback_debate(context: Dict[str, Any], agent_results: Dict[str, Any]) -> Dict[str, Any]:
    title = context.get("title", "The Startup")
    industry = context.get("industry", "Technology")

    turns = [
        {
            "agent_name": "Investor Agent",
            "role_title": "Venture Mentor",
            "avatar_color": "#F59E0B",
            "round_number": 1,
            "message": f"Market demand in {industry} is growing fast, but we need proof that everyday customers will actually pay real money.",
            "targeted_agent": "Devil's Advocate",
            "sentiment": "challenge"
        },
        {
            "agent_name": "Devil's Advocate",
            "role_title": "Reality Check",
            "avatar_color": "#F43F5E",
            "round_number": 1,
            "message": "Exactly. People love free tools, but 80% vanish the moment you ask for a paid monthly subscription.",
            "targeted_agent": "Investor Agent",
            "sentiment": "challenge"
        },
        {
            "agent_name": "Customer Advocate",
            "role_title": "User Voice",
            "avatar_color": "#10B981",
            "round_number": 1,
            "message": "Plus, if the screen has too much text or complicated steps, field users will close the app in 20 seconds.",
            "targeted_agent": "Devil's Advocate",
            "sentiment": "agreement"
        },
        {
            "agent_name": "Business Strategist",
            "role_title": "Growth Planner",
            "avatar_color": "#3B82F6",
            "round_number": 2,
            "message": "That's why we shouldn't sell alone! Partner with local businesses or co-ops who pay the fee for their members.",
            "targeted_agent": "Customer Advocate",
            "sentiment": "defense"
        },
        {
            "agent_name": "Lender Agent",
            "role_title": "Money & Grant Advisor",
            "avatar_color": "#14B8A6",
            "round_number": 2,
            "message": "Good plan. And do not borrow bank money yet; use government grants up to ₹20 Lakhs to stay safe.",
            "targeted_agent": "Business Strategist",
            "sentiment": "challenge"
        },
        {
            "agent_name": "Legal Advisor",
            "role_title": "Legal Shield",
            "avatar_color": "#8B5CF6",
            "round_number": 2,
            "message": "Just ensure you put a clear disclaimer that AI answers are recommendations, and get simple permission to store user data.",
            "targeted_agent": "Business Strategist",
            "sentiment": "defense"
        }
    ]

    synthesis = {
        "consensus": [
            "Do not spend heavy money on paid online advertisements.",
            "Partner with existing local businesses or associations to reach people quickly.",
            "Avoid high-interest bank loans; apply for government startup grants instead.",
            "Keep the app dead simple to use and put clear legal disclaimers on every screen."
        ],
        "disagreements": [
            "Investor wants rapid customer growth, while Devil's Advocate warns against free users burning server cash.",
            "Lender advises saving all cash, while Strategist wants to spend small amounts testing partnerships."
        ],
        "critical_assumptions": [
            "Users will find immediate value within 60 seconds of testing.",
            "Local partners will agree to recommend the tool to their community."
        ],
        "key_risks": [
            "Customers hesitating to pay online.",
            "Server bills rising faster than paying user subscriptions."
        ],
        "strategic_mandate": "Get 30 real users to pay a small test fee before spending money on big app features or ads."
    }

    return {"turns": turns, "synthesis": synthesis}
