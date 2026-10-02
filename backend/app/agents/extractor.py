import re
from typing import Dict, Any, Optional
from app.agents.core import groq_client

EXTRACTOR_SYSTEM_PROMPT = """You are an expert Startup Venture Analyst.
Your task is to analyze an unstructured startup idea and extract clear, structured venture attributes.

Extract the following JSON fields:
{
  "title": "A concise, punchy 2-4 word project or venture title",
  "industry": "Primary industry sector (e.g., AgriTech, FinTech, HealthTech, EdTech, ClimateTech, B2B SaaS)",
  "problem": "The core pain point or market friction being addressed (2-3 sentences)",
  "solution": "The proposed product, technology, or service solution (2-3 sentences)",
  "target_customers": "Specific ideal customer profiles / buyer personas",
  "business_model": "Type of business model (B2B, B2C, B2B2C, Marketplace, D2C, Hardware+SaaS)",
  "revenue_model": "How the business generates cash flow (e.g. Subscription, Freemium, Commission, Pay-per-scan)",
  "location": "Target geographic market / region (e.g. India, Emerging Markets, Global)",
  "startup_stage": "Stage (e.g. Just an Idea, Prototype, MVP, Early Revenue, Growth)",
  "key_technologies": ["List", "of", "core", "technologies"]
}
"""

def extract_startup_context(raw_idea: str, stage: str = "Just an Idea", user_title: Optional[str] = None) -> Dict[str, Any]:
    user_prompt = f"Startup Idea: \"{raw_idea}\"\nUser Specified Stage: \"{stage}\"\nUser Specified Title: \"{user_title or 'None'}\""

    extracted = groq_client.chat_json(EXTRACTOR_SYSTEM_PROMPT, user_prompt, temperature=0.2)
    if extracted and isinstance(extracted, dict) and "industry" in extracted:
        # Override title if user explicitly gave one
        if user_title and user_title.strip():
            extracted["title"] = user_title.strip()
        if not extracted.get("startup_stage"):
            extracted["startup_stage"] = stage
        return extracted

    # Intelligent Fallback extraction if Groq is not configured or fails
    return _intelligent_fallback_extractor(raw_idea, stage, user_title)

def _intelligent_fallback_extractor(raw_idea: str, stage: str, user_title: Optional[str]) -> Dict[str, Any]:
    lower = raw_idea.lower()
    
    # Industry detection
    industry = "Technology & SaaS"
    key_tech = ["Cloud", "Web App"]
    if any(k in lower for k in ["farm", "crop", "agri", "harvest", "soil", "plant"]):
        industry = "AgriTech & Rural Tech"
        key_tech = ["Computer Vision", "Mobile AI", "Edge Computing"]
    elif any(k in lower for k in ["health", "doctor", "medical", "patient", "clinic", "hospital", "disease"]):
        industry = "HealthTech & Diagnostics"
        key_tech = ["Medical AI", "Telemetry", "HIPAA/DPDP Compliant Cloud"]
    elif any(k in lower for k in ["bank", "loan", "payment", "credit", "fintech", "invest", "wealth"]):
        industry = "FinTech & Digital Lending"
        key_tech = ["Account Aggregator API", "Credit Scoring Algorithms", "Secure Payment Gateway"]
    elif any(k in lower for k in ["learn", "student", "school", "course", "college", "tutor", "education"]):
        industry = "EdTech & Learning"
        key_tech = ["Interactive Learning Engine", "Adaptive LLM Tutoring"]
    elif any(k in lower for k in ["shop", "ecommerce", "store", "delivery", "logistics", "retail"]):
        industry = "E-Commerce & Supply Chain"
        key_tech = ["Route Optimization", "Inventory Automation"]
    elif any(k in lower for k in ["ai", "camera", "vision", "detect", "algorithm"]):
        key_tech = ["Deep Learning", "Convolutional Neural Networks", "Mobile SDK"]

    # Title detection
    if user_title and user_title.strip():
        title = user_title.strip()
    else:
        # Create title from key phrases
        words = [w for w in re.findall(r'\b[A-Za-z]{4,}\b', raw_idea) if w.lower() not in ["want", "build", "helps", "their", "using", "that", "this", "with", "have"]]
        if len(words) >= 2:
            title = f"{words[0].capitalize()} {words[1].capitalize()}"
        else:
            title = f"{industry.split()[0]} Solution"

    # Business & Revenue model
    b_model = "B2B2C" if "farmer" in lower or "doctor" in lower else ("B2B SaaS" if "enterprise" in lower or "business" in lower else "B2C Mobile")
    r_model = "Freemium & Micro-Subscriptions" if "affordable" in lower or "mobile" in lower else "Tiered SaaS Subscription"

    return {
        "title": title,
        "industry": industry,
        "problem": f"Founders identify critical market inefficiency where end-users face high costs, delayed diagnostic feedback, and restricted access to domain experts.",
        "solution": f"A lightweight, scalable mobile and cloud platform utilizing tailored algorithms and intuitive interfaces to deliver instantaneous automated advisory.",
        "target_customers": "Small-to-medium operators, individual practitioners, and regional community cooperatives seeking cost-efficient digital tooling.",
        "business_model": b_model,
        "revenue_model": r_model,
        "location": "India & Developing Global South Economies",
        "startup_stage": stage or "Just an Idea",
        "key_technologies": key_tech
    }
