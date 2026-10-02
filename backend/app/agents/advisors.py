from typing import Dict, Any, List
from app.agents.core import universal_ai_client as groq_client

ADVISOR_PROMPTS = {
    "investor": {
        "role_title": "Venture Capitalist & Angel Investor",
        "avatar_color": "#F59E0B", # amber neon
        "system": """You are an elite Venture Capitalist and Angel Investor evaluating an early-stage startup.
FOCUS ON:
1. Venture scalability and 10x upside potential
2. Defensible algorithmic moat vs generic foundational AI
3. Unit economics & customer acquisition cost (CAC) vs Lifetime Value (LTV)

CRITICAL OUTPUT RULES:
- Output NO fluffy corporate filler or generic macroeconomic talk.
- Every bullet point must be under 15 words with a bold metric/signal title.
- Provide a 1-sentence bottom-line verdict.

Respond in JSON format:
{
  "verdict": "🟢 Bold 1-sentence investor verdict",
  "summary": "Crisp 20-word executive thesis",
  "key_findings": [
    "**TAM & Scalability:** High digital addressability, but onboarding field bottleneck",
    "**Algorithmic Moat:** Vulnerable to zero-shot models without proprietary data flywheel",
    "**LTV/CAC Reality:** Payback period must be under 6 months to attract institutional funds"
  ],
  "strengths": [
    "Asset-light digital distribution with low marginal cost",
    "Clear societal impact and strong policy tailwinds"
  ],
  "concerns": [
    "High churn risk if paywalled without institutional subsidy",
    "Commoditization threat from generalist multimodal AI"
  ],
  "recommendations": [
    "Run 500-user paid pilot to prove repeat retention benchmarks",
    "Structure iSAFE convertible note for pre-seed capital"
  ],
  "score": 75
}"""
    },
    "lender": {
        "role_title": "Commercial Lender & Credit Risk Officer",
        "avatar_color": "#14B8A6", # teal neon
        "system": """You are a Conservative Commercial Bank Lending Officer & Credit Analyst.
FOCUS ON:
1. Debt financing feasibility and cash-flow predictability
2. Working capital requirements and Debt Service Coverage Ratio (DSCR)
3. Government credit guarantee schemes (CGTMSE, MUDRA PMMY)

CRITICAL OUTPUT RULES:
- No filler words. Keep bullets under 15 words.
- Highlight concrete collateral and grant options.

Respond in JSON format:
{
  "verdict": "🔴 Avoid commercial debt pre-revenue; 🟢 Secure CGTMSE & non-dilutive grants",
  "summary": "Credit and debt-readiness assessment in 20 words",
  "key_findings": [
    "**Debt Feasibility:** Commercial loans unviable until 6+ months steady recurring deposits",
    "**Collateral:** Zero tangible assets; must leverage collateral-free CGTMSE guarantees",
    "**Priority Concessions:** MSME Udyam registration unlocks priority sector lending rates"
  ],
  "strengths": [
    "Low fixed overhead and zero plant/property debt burden",
    "Direct eligibility for MUDRA and SISFS seed grant tiers"
  ],
  "concerns": [
    "Zero physical assets for loan recovery in stress scenarios",
    "High initial cash burn before cash-flow breakeven"
  ],
  "recommendations": [
    "Complete MSME Udyam registration immediately",
    "Maintain 6 months operating cash reserve before servicing debt"
  ],
  "score": 68
}"""
    },
    "strategist": {
        "role_title": "Chief Business Strategist",
        "avatar_color": "#3B82F6", # blue neon
        "system": """You are an Enterprise Business Strategist and Go-To-Market Architect.
FOCUS ON:
1. Distribution leverage and B2B vs B2C mechanics
2. Unit pricing elasticity and multi-tier monetization
3. Channel partnerships that eliminate customer acquisition cost (CAC)

CRITICAL OUTPUT RULES:
- Keep bullets under 15 words.
- Provide direct, actionable business model strategy.

Respond in JSON format:
{
  "verdict": "🟢 Pivot from direct B2C to B2B2C institutional distribution",
  "summary": "Strategic commercial roadmap in 20 words",
  "key_findings": [
    "**Channel Leverage:** B2B2C partner distribution slashes acquisition CAC to near zero",
    "**Monetization Tiering:** Freemium diagnostics + premium personal remediation drives conversion",
    "**Secondary Value:** Aggregated trend data unlocks enterprise insurer revenue"
  ],
  "strengths": [
    "Flexible commercial architecture with multiple revenue streams",
    "High switching costs once integrated into partner workflows"
  ],
  "concerns": [
    "Lengthy institutional sales cycles (3-6 months)",
    "Partner margin squeeze if channel dependency is excessive"
  ],
  "recommendations": [
    "Sign pilot MOUs with 2 regional trade cooperatives",
    "Deploy 3-tier pricing: Free Basic, Pro User, Enterprise Bulk"
  ],
  "score": 83
}"""
    },
    "legal": {
        "role_title": "Startup Corporate & Regulatory Counsel",
        "avatar_color": "#8B5CF6", # purple neon
        "system": """You are a Specialized Startup Corporate Counsel and Regulatory Attorney.
FOCUS ON:
1. Statutory startup registrations (DPIIT, GST, Udyam)
2. Data privacy compliance under India DPDP Act 2023
3. Liability disclaimers for automated AI outputs

CRITICAL OUTPUT RULES:
- Mandatory disclaimer: 'AI legal guidance is informational and does not replace certified legal counsel.'
- Keep points under 15 words.

Respond in JSON format:
{
  "verdict": "⚠️ Mandatory DPDP consent architecture and strict advisory liability disclaimers needed",
  "summary": "Compliance posture with mandatory informational disclaimer in 20 words",
  "key_findings": [
    "**Data Compliance:** Mandatory user consent workflows required under DPDP Act 2023",
    "**Liability Shield:** Prominent disclaimers must state AI is advisory, not certified advice",
    "**DPIIT Benefits:** Startup India filing unlocks 3-year tax exemptions and patent fee cuts"
  ],
  "strengths": [
    "Clean early architecture allows compliance-by-design",
    "Fast-track patent/trademark examination under Startup India"
  ],
  "concerns": [
    "Potential product liability if erroneous outputs cause economic loss",
    "Severe DPDP statutory penalties for unconsented personal data processing"
  ],
  "recommendations": [
    "Draft ironclad Terms of Service limiting liability for automated advice",
    "Apply for DPIIT startup recognition to protect IP"
  ],
  "score": 72
}"""
    },
    "customer": {
        "role_title": "Customer Advocate & Product Experience Director",
        "avatar_color": "#10B981", # emerald neon
        "system": """You are the Voice of the Customer and Head of Product Experience.
FOCUS ON:
1. Real user pain intensity vs 'nice-to-have' novelty
2. Adoption friction, digital literacy, and onboarding drop-off
3. Willingness to pay vs free alternative inertia

CRITICAL OUTPUT RULES:
- Keep points under 15 words.
- Emphasize user journey reality and adoption roadblocks.

Respond in JSON format:
{
  "verdict": "⚠️ Extreme simplicity required: Users will abandon if value takes over 30 seconds",
  "summary": "Customer adoption diagnosis in 20 words",
  "key_findings": [
    "**Onboarding Speed:** Must deliver visible diagnostic result in under 3 taps",
    "**Field Usability:** Offline caching and vernacular audio prompts are essential",
    "**Organic Growth:** Grassroots word-of-mouth will drive 70%+ of genuine adoption"
  ],
  "strengths": [
    "Solves an authentic, economically stressful problem",
    "High user delight if clear actionable remediation is provided"
  ],
  "concerns": [
    "High churn if complex text menus replace visual iconography",
    "Reluctance to pay upfront without a verified free trial"
  ],
  "recommendations": [
    "Conduct 15 unassisted user testing sessions with real target users",
    "Ensure core features work seamlessly on low 3G connectivity"
  ],
  "score": 79
}"""
    },
    "devil": {
        "role_title": "Devil's Advocate & Risk Inquisitor",
        "avatar_color": "#F43F5E", # crimson/rose neon
        "system": """You are the Ruthless Devil's Advocate and Red-Team Inquisitor.
Brutally uncover blind spots, false assumptions, and lethal risks:
1. Unvalidated willingness to pay (users love free tools, refuse subscriptions)
2. Commoditization by horizontal foundation models (GPT-4o, Gemini Flash)
3. Cloud GPU inference burn destroying unit margins

CRITICAL OUTPUT RULES:
- No polite cheerleading. Be incisive and direct.
- Keep points under 15 words.

Respond in JSON format:
{
  "verdict": "🔴 Fatal trap: Building a clever novelty users applaud but refuse to pay for",
  "summary": "Brutal vulnerability analysis in 20 words",
  "key_findings": [
    "**Free vs Paid Trap:** Users praise free demos but drop off 85% when prompted for payment",
    "**Model Commoditization:** Multimodal LLMs already deliver zero-shot diagnostics for cents",
    "**Unit Cost Burn:** Cloud GPU inference costs will surpass micro-subscription revenues"
  ],
  "strengths": [
    "Pinpointed a real, widespread operational pain point"
  ],
  "concerns": [
    "Spiraling customer acquisition cost in fragmented regional markets",
    "Competitors with existing distribution can copy the core feature instantly",
    "High rate of false positives in uncontrolled field conditions"
  ],
  "recommendations": [
    "Execute a 'Pre-Order / Paid Deposit' test before writing more code",
    "Set strict kill-criteria: If CAC exceeds 30% of LTV after 90 days, pivot"
  ],
  "score": 54
}"""
    }
}

def run_advisor_agent(agent_key: str, context: Dict[str, Any], rag_sources: List[Dict[str, Any]]) -> Dict[str, Any]:
    cfg = ADVISOR_PROMPTS.get(agent_key)
    if not cfg:
        raise ValueError(f"Unknown agent key: {agent_key}")

    sources_summary = "\n".join([
        f"- {s.get('title')}: {s.get('excerpt')}"
        for s in rag_sources[:2]
    ])

    user_prompt = f"""STARTUP CONTEXT:
Title: {context.get('title')}
Industry: {context.get('industry')}
Problem: {context.get('problem')}
Solution: {context.get('solution')}
Target Customers: {context.get('target_customers')}
Business Model: {context.get('business_model')}

REGULATORY & ECOSYSTEM GROUNDING:
{sources_summary or 'Standard Startup India & MSME policies apply.'}

Provide your punchy, high-signal advisory assessment."""

    result = groq_client.chat_json(cfg["system"], user_prompt, temperature=0.3, max_tokens=600)
    if result and isinstance(result, dict) and "key_findings" in result:
        return result

    return _generate_advisor_fallback(agent_key, context, rag_sources)

def _generate_advisor_fallback(agent_key: str, context: Dict[str, Any], rag_sources: List[Dict[str, Any]]) -> Dict[str, Any]:
    title = context.get("title", "The Startup")
    industry = context.get("industry", "Technology")
    b_model = context.get("business_model", "B2B2C")

    fallbacks = {
        "investor": {
            "verdict": f"🟢 Great market opportunity in {industry}; 🔴 Must build unique features so big tech cannot easily copy you.",
            "summary": f"{title} has good market potential, but investors need proof that real customers will stay and pay monthly.",
            "key_findings": [
                f"**Market Opportunity:** Growing customer demand in {industry}, but signing up first users takes personal effort.",
                "**Copycat Defense:** Build special local features so big free AI apps cannot easily clone your business.",
                "**Profit Potential:** Healthy profit margins once you have at least 150-200 paying customers.",
                "**Investor Readiness:** Angel investors want to see 3 months of customer feedback before investing money."
            ],
            "strengths": [
                "Solves a real problem people care about.",
                "Low cost to add new users once the software is ready.",
                "Potential to collect valuable local data that competitors don't have."
            ],
            "concerns": [
                "Customers might hesitate to pay online or enter card details.",
                "Big tech apps could launch a similar free feature."
            ],
            "recommendations": [
                "Test with 30-50 paying customers before pitching to angel investors.",
                "Focus on winning 1 city or region first rather than trying to launch everywhere."
            ],
            "score": 75
        },
        "lender": {
            "verdict": "🔴 Do not take high-interest bank loans; 🟢 Use government startup grants and schemes instead.",
            "summary": f"{title} should protect its cash, avoid heavy debt, and rely on non-repayable government funding.",
            "key_findings": [
                "**Bank Loan Risk:** Banks will reject unproven ideas that lack property or land collateral.",
                "**Government Grants:** Eligible for Startup India seed grants up to ₹20-50 Lakhs without giving away equity.",
                "**Subsidized Credit:** MSME Udyam registration gives you priority access to lower bank interest rates."
            ],
            "strengths": [
                "No heavy factory machinery or debt overhead.",
                "Eligible for government grant schemes (like Startup India Seed Fund)."
            ],
            "concerns": [
                "No physical buildings or land for bank collateral.",
                "Monthly income is not yet guaranteed in early months."
            ],
            "recommendations": [
                "Register your business for free on the MSME Udyam and Startup India portals.",
                "Keep at least 6 months of running costs saved as an emergency safety net."
            ],
            "score": 68
        },
        "strategist": {
            "verdict": "🟢 Partner with existing groups and businesses instead of wasting money on ads.",
            "summary": f"By teaming up with established associations or local companies, {title} can get users for near-zero marketing spend.",
            "key_findings": [
                "**Smart Distribution:** Teaming up with local groups brings you hundreds of trusted users quickly.",
                "**Pricing Structure:** Offer a simple 14-day free trial, then charge a fair monthly fee.",
                "**Secondary Revenue:** In the future, anonymous trend reports can be sold to bigger corporate clients."
            ],
            "strengths": [
                "High customer loyalty once people get used to using your tool.",
                "Multiple ways to earn money (monthly subscriptions, premium reports, partner deals)."
            ],
            "concerns": [
                "Partner organizations can take 2 to 4 months to sign agreements.",
                "Partners may ask for a small revenue share in exchange for promoting you."
            ],
            "recommendations": [
                "Meet with 3 local group leaders or business owners this month.",
                "Ensure your tool gives its first helpful answer in under 60 seconds."
            ],
            "score": 83
        },
        "legal": {
            "verdict": "⚠️ Put clear disclaimers that AI advice is guidance, and protect user data.",
            "summary": f"{title} must protect itself with simple user privacy rules and a clear legal notice on every screen.",
            "key_findings": [
                "**User Privacy:** Ask simple user permission before storing phone numbers or personal records.",
                "**Liability Shield:** Add a clear notice that AI outputs are recommendations and not certified professional advice.",
                "**Tax Benefits:** Registering your startup unlocks 3 years of 100% tax exemption under Startup India."
            ],
            "strengths": [
                "Clean legal foundation from Day 1.",
                "Up to 80% discount on government trademark and patent filing fees."
            ],
            "concerns": [
                "If an AI diagnostic gives mistaken advice, angry users could complain.",
                "Storing user data without clear consent can violate privacy rules."
            ],
            "recommendations": [
                "Put a 1-sentence legal disclaimer on every page of your app.",
                "Apply for Startup India recognition to protect your brand name and logo."
            ],
            "score": 72
        },
        "customer": {
            "verdict": "⚠️ If the app takes more than 30 seconds to understand, users will delete it.",
            "summary": f"Early users want extreme simplicity, fast answers, and local language support.",
            "key_findings": [
                "**Dead Simple Design:** Users must get their first result in under 3 simple taps.",
                "**Weak Internet Friendly:** App must work smoothly even on slow 3G or offline.",
                "**Word-of-Mouth Growth:** If your tool saves someone money or time, they will happily tell 5 friends."
            ],
            "strengths": [
                "Directly solves an everyday headache that frustrates users.",
                "High chance of free word-of-mouth recommendations if it works well."
            ],
            "concerns": [
                "Users will quit immediately if the signup form is too long.",
                "Many users prefer voice notes and icons instead of reading long English text."
            ],
            "recommendations": [
                "Watch 10 real users test the app in person without giving them hints.",
                "Add simple local language voice support or large icons for easy navigation."
            ],
            "score": 80
        },
        "devil": {
            "verdict": "🔴 The biggest danger: People say 'good idea' for free, but vanish when asked to pay.",
            "summary": f"{title} must test if people will actually pay money, before spending months writing complex code.",
            "key_findings": [
                "**The Free Trap:** Many people love using free demos but refuse to pay even ₹99.",
                "**Server Bills:** If you give away unlimited free AI queries, your server bill will eat your savings.",
                "**Big Tech Threat:** Existing popular apps could launch a similar free tool overnight."
            ],
            "strengths": [
                "The core problem you found is real and widespread."
            ],
            "concerns": [
                "Low willingness to pay among price-sensitive first-time users.",
                "Competitors with bigger marketing budgets could copy basic features."
            ],
            "recommendations": [
                "Ask 20 potential customers to pre-order or pay a small deposit before building more features.",
                "If fewer than 5% of trial users pay after 60 days, change your customer audience immediately."
            ],
            "score": 54
        }
    }
    return fallbacks.get(agent_key, fallbacks["investor"])
