# 🚀 StartupAdvisor AI
### *Your AI-Powered Startup Advisory Board*

A modern, production-grade Generative AI multi-agent platform designed for startup founders, venture analysts, and engineering decision support. 

---

## 🌟 Key Highlights & Engineering Contribution

StartupAdvisor AI solves a foundational problem in entrepreneurship: **early-stage founders need multi-disciplinary executive perspectives (VC, commercial credit, growth strategy, legal compliance, and customer advocacy) before burning capital**, but cannot afford traditional board members or advisory firms.

| Technology Dimension | Implementation in StartupAdvisor AI |
| :--- | :--- |
| **Generative AI** | Groq API (`llama-3.3-70b-versatile` / `llama-3.1-8b-instant`) powering structured venture analysis and reasoning. |
| **Multi-Agent AI** | 6 specialized autonomous advisor agents with unique persona prompts, risk tolerances, and scoring metrics. |
| **AI Collaboration / Debate** | Structured 2-round cross-examination dialectic where agents challenge and defend assumptions, followed by a Synthesis Agent. |
| **RAG (Retrieval-Augmented Generation)** | TF-IDF vector retrieval engine matching startup queries against a curated Indian startup ecosystem corpus (Startup India, MUDRA, CGTMSE, MSME Udyam, DPDP Act 2023). |
| **Engineering Decision Support** | Interactive 5×5 Impact × Likelihood Risk Matrix, 2×2 SWOT, time-phased 7/30/90-Day Action Roadmap, and ReportLab PDF compilation. |
| **Design System** | **Premium Light Modern Design** (warm ivory `#FAF8F5`, crisp white cards, charcoal typography, terracotta and emerald accents, Google Fonts *Poppins* & *Inter*). |

---

## 🤖 The 6 Specialized AI Advisors

1. **💼 Investor Agent (Venture Capitalist & Angel Investor)**
   - Evaluates addressable market sizing (TAM / SAM / SOM), capital efficiency, defensible moats, 10x upside scalability, and Cap table risks.
2. **🏦 Lender Agent (Commercial Lender & Credit Risk Officer)**
   - Evaluates debt service coverage (DSCR), capital expenditure vs. operating expenditure, collateral adequacy, working capital predictability, and credit guarantees (CGTMSE, MUDRA).
3. **📈 Business Strategist (Chief Business Strategist & GTM Architect)**
   - Evaluates business model mechanics (B2B, B2C, B2B2C), revenue monetization streams, unit economics (LTV/CAC), and viral distribution loops.
4. **⚖️ Legal Advisor (Startup Corporate & Regulatory Counsel)**
   - Audits corporate formation (DPIIT recognition, Section 80-IAC tax holidays), intellectual property (patent fast-tracking, trade secrets), and compliance with the **Digital Personal Data Protection Act (DPDP Act 2023)**. Includes mandatory disclaimers.
5. **👥 Customer Advocate (Voice of the Customer & Product Experience)**
   - Analyzes target user friction, digital literacy constraints, vernacular accessibility, onboarding speed (<3 taps), and authentic willingness-to-pay.
6. **⚔️ Devil's Advocate (Red-Team Risk Inquisitor)**
   - Rigorously stress-tests rosy forecasts, unit economics traps, foundational AI commoditization, and lethal failure modes.

---

## 🏗️ Architecture & Pipeline Flow

```text
Founder Idea ("Help small farmers identify crop diseases via phone camera")
                        ↓
            FastAPI Backend Service
                        ↓
             Context Extraction Agent
                        ↓
             TF-IDF RAG Knowledge Base
   (Startup India, MUDRA, CGTMSE, MSME, DPDP Act)
                        ↓
             6 Autonomous AI Advisors
   (Investor, Lender, Strategist, Legal, Customer, Devil)
                        ↓
          Multi-Agent Cross-Evaluation Debate
            (Round 1 Challenges & Round 2 Defense)
                        ↓
                   Synthesis Agent
                        ↓
          Structured Decision Support Output
    • Viability Gauge (0-100) & Sub-Metrics
    • 2×2 Strategic SWOT Matrix
    • 5×5 Interactive Risk Matrix (Impact × Likelihood)
    • 7 / 30 / 90-Day Time-Phased Action Roadmap
    • ReportLab PDF Report Export
    • SQLite Persistent Historical Storage
```

---

## 🔑 Security & Groq API Key Management

The architecture strictly complies with enterprise security protocols:
- **Zero Client-Side Exposure**: The Groq API key is managed **exclusively on the backend** and never exposed to the React browser, never saved in localStorage, and never output in frontend logs or responses.
- **Dynamic Configuration**: Configure or update the key dynamically in the UI under **Settings** or the **Connect Groq AI** modal.
- **Offline Intelligence Simulator**: If no Groq API key is configured initially, the system seamlessly operates an offline intelligence simulator so all UI dashboards, charts, multi-agent debates, and PDF generation are 100% testable out of the box.

---

## 💻 Tech Stack

### Backend
- **Language**: Python 3.11+
- **Framework**: FastAPI
- **Data Validation**: Pydantic v2
- **Database / ORM**: SQLAlchemy + SQLite
- **RAG Engine**: Scikit-Learn TF-IDF Vectorizer + Cosine Similarity
- **PDF Generation**: ReportLab
- **AI Inference**: Groq SDK (`groq`)

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (Custom warm light palette)
- **Icons**: Lucide React
- **Charts / Visuals**: Recharts + Custom SVG Gauges
- **Animations**: Framer Motion + Canvas Confetti

---

## ⚡ Quick Start & Local Execution

### 1. Start the FastAPI Backend
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The backend API is available at `http://localhost:8000`. Interactive OpenAPI documentation is at `http://localhost:8000/docs`.

### 2. Start the Vite React Frontend
```bash
cd frontend
npm run dev
```
The web application is accessible at `http://localhost:5173`.

---

## 📄 License & Academic Note
Built as an advanced engineering demonstration of Generative AI, Multi-Agent AI systems, and Retrieval-Augmented Generation for venture decision support.
