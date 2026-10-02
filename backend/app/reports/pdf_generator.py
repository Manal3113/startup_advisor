import io
import json
from datetime import datetime
from typing import Dict, Any, List

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def generate_startup_pdf(startup: Any, analysis: Any, agent_results: List[Any], debate: Any) -> io.BytesIO:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    # Custom palette matching our warm light modern theme
    c_primary = colors.HexColor("#1E293B")    # Charcoal
    c_accent = colors.HexColor("#E06D53")     # Warm Terracotta
    c_secondary = colors.HexColor("#0D9488")  # Muted Teal
    c_card_bg = colors.HexColor("#F8F9FA")    # Clean warm off-white
    c_border = colors.HexColor("#E2E8F0")

    # Typography styles
    style_title = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=c_primary,
        spaceAfter=4
    )
    style_subtitle = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=c_accent,
        spaceAfter=15
    )
    style_h1 = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=c_primary,
        spaceBefore=12,
        spaceAfter=6
    )
    style_h2 = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=c_secondary,
        spaceBefore=8,
        spaceAfter=4
    )
    style_body = ParagraphStyle(
        'DocBody',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#334155")
    )
    style_bold = ParagraphStyle(
        'DocBold',
        parent=style_body,
        fontName='Helvetica-Bold'
    )
    style_callout = ParagraphStyle(
        'DocCallout',
        parent=style_body,
        fontName='Helvetica-Oblique',
        textColor=colors.HexColor("#475569")
    )

    story = []

    # Parse JSON properties safely
    context = startup.get_context_dict() if hasattr(startup, 'get_context_dict') else {}
    strengths = json.loads(analysis.strengths) if isinstance(analysis.strengths, str) else (analysis.strengths or [])
    weaknesses = json.loads(analysis.weaknesses) if isinstance(analysis.weaknesses, str) else (analysis.weaknesses or [])
    opportunities = json.loads(analysis.opportunities) if isinstance(analysis.opportunities, str) else (analysis.opportunities or [])
    risks = json.loads(analysis.risks) if isinstance(analysis.risks, str) else (analysis.risks or [])
    risk_matrix = json.loads(analysis.risk_matrix) if isinstance(analysis.risk_matrix, str) else (analysis.risk_matrix or [])
    action_plan = json.loads(analysis.action_plan) if isinstance(analysis.action_plan, str) else (analysis.action_plan or {})
    rag_sources = json.loads(analysis.rag_sources) if isinstance(analysis.rag_sources, str) else (analysis.rag_sources or [])

    # HEADER / COVER TITLE
    story.append(Paragraph("StartupAdvisor AI — Executive Evaluation", style_subtitle))
    story.append(Paragraph(startup.title or "Venture Advisory Assessment", style_title))
    
    meta_text = f"<b>Generated:</b> {datetime.utcnow().strftime('%B %d, %Y')} | <b>Stage:</b> {startup.stage} | <b>Sector:</b> {context.get('industry', 'Technology')}"
    story.append(Paragraph(meta_text, style_body))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_border, spaceBefore=4, spaceAfter=14))

    # SECTION 1: VIABILITY SCORECARD
    story.append(Paragraph("1. AI-Generated Viability Assessment", style_h1))
    score_data = [
        [
            Paragraph(f"<b>Overall Viability</b><br/><font size=16 color='#059669'><b>{analysis.viability_score} / 100</b></font>", style_body),
            Paragraph(f"<b>Market Potential</b><br/><font size=14><b>{analysis.market_potential_score}%</b></font>", style_body),
            Paragraph(f"<b>Business Model</b><br/><font size=14><b>{analysis.business_model_score}%</b></font>", style_body),
            Paragraph(f"<b>Financial Feasibility</b><br/><font size=14><b>{analysis.financial_feasibility_score}%</b></font>", style_body),
            Paragraph(f"<b>Risk Level</b><br/><font size=14 color='#E06D53'><b>{analysis.risk_level}</b></font>", style_body)
        ]
    ]
    t_scores = Table(score_data, colWidths=[110, 105, 105, 105, 105])
    t_scores.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_card_bg),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOX', (0, 0), (-1, -1), 1, c_border),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, c_border),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(t_scores)
    story.append(Paragraph("<font size=7 color='#64748B'><i>Note: AI-generated assessment — not a guarantee of business success. Evaluated across 6 specialized perspectives.</i></font>", style_body))
    story.append(Spacer(1, 14))

    # SECTION 2: EXTRACTED VENTURE CONTEXT
    story.append(Paragraph("2. Startup Overview & Context", style_h1))
    story.append(Paragraph(f"<b>Raw Idea:</b> \"{startup.raw_idea}\"", style_callout))
    story.append(Spacer(1, 6))

    context_table_data = [
        [Paragraph("<b>Problem:</b>", style_bold), Paragraph(context.get("problem", "N/A"), style_body)],
        [Paragraph("<b>Solution:</b>", style_bold), Paragraph(context.get("solution", "N/A"), style_body)],
        [Paragraph("<b>Target Customers:</b>", style_bold), Paragraph(context.get("target_customers", "N/A"), style_body)],
        [Paragraph("<b>Business & Revenue Model:</b>", style_bold), Paragraph(f"{context.get('business_model', 'N/A')} | {context.get('revenue_model', 'N/A')}", style_body)],
        [Paragraph("<b>Key Technologies:</b>", style_bold), Paragraph(", ".join(context.get("key_technologies", [])) or "Cloud, Mobile", style_body)],
    ]
    t_context = Table(context_table_data, colWidths=[130, 400])
    t_context.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.white),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('LINEBELOW', (0, 0), (-1, -1), 0.5, colors.HexColor("#F1F5F9")),
    ]))
    story.append(t_context)
    story.append(Spacer(1, 14))

    # SECTION 3: 2x2 SWOT MATRIX
    story.append(Paragraph("3. SWOT Analysis", style_h1))
    swot_data = [
        [
            Paragraph("<b>🟢 STRENGTHS</b><br/>" + "<br/>• ".join([""] + strengths), style_body),
            Paragraph("<b>🔴 WEAKNESSES</b><br/>" + "<br/>• ".join([""] + weaknesses), style_body)
        ],
        [
            Paragraph("<b>🔵 OPPORTUNITIES</b><br/>" + "<br/>• ".join([""] + opportunities), style_body),
            Paragraph("<b>🟠 RISKS</b><br/>" + "<br/>• ".join([""] + risks), style_body)
        ]
    ]
    t_swot = Table(swot_data, colWidths=[265, 265])
    t_swot.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), colors.HexColor("#F0FDF4")), # soft green
        ('BACKGROUND', (1, 0), (1, 0), colors.HexColor("#FEF2F2")), # soft red
        ('BACKGROUND', (0, 1), (0, 1), colors.HexColor("#EFF6FF")), # soft blue
        ('BACKGROUND', (1, 1), (1, 1), colors.HexColor("#FFF7ED")), # soft orange
        ('BOX', (0, 0), (-1, -1), 1, c_border),
        ('INNERGRID', (0, 0), (-1, -1), 1, c_border),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(t_swot)
    story.append(Spacer(1, 14))

    # SECTION 4: 6 SPECIALIZED AI ADVISOR FINDINGS
    story.append(PageBreak())
    story.append(Paragraph("4. Specialized AI Advisory Board Findings", style_h1))
    story.append(Paragraph("Independent cross-functional evaluations from six autonomous expert agents:", style_body))
    story.append(Spacer(1, 8))

    for ar in agent_results:
        res_dict = json.loads(ar.result) if isinstance(ar.result, str) else (ar.result or {})
        story.append(Paragraph(f"<b>{ar.agent_name}</b> ({ar.role_title}) — Score: {res_dict.get('score', 75)}/100", style_h2))
        story.append(Paragraph(f"<i>{res_dict.get('summary', '')}</i>", style_callout))
        story.append(Spacer(1, 4))
        
        findings_str = "<b>Key Findings:</b> " + " | ".join(res_dict.get("key_findings", [])[:3])
        story.append(Paragraph(findings_str, style_body))
        
        recs_str = "<b>Top Recommendations:</b> " + " • ".join(res_dict.get("recommendations", [])[:2])
        story.append(Paragraph(recs_str, style_body))
        story.append(Spacer(1, 8))

    # SECTION 5: AI DEBATE HIGHLIGHTS & SYNTHESIS
    story.append(Spacer(1, 8))
    story.append(Paragraph("5. Multi-Agent Debate & Synthesis", style_h1))
    
    if debate:
        d_content = json.loads(debate.debate_content) if isinstance(debate.debate_content, str) else (debate.debate_content or [])
        d_synthesis = json.loads(debate.synthesis) if isinstance(debate.synthesis, str) else (debate.synthesis or {})

        story.append(Paragraph("<b>Cross-Agent Debate Highlights:</b>", style_bold))
        for turn in d_content[:4]:
            speaker = turn.get("agent_name", "Agent")
            msg = turn.get("message", "")
            target = f" [to {turn.get('targeted_agent')}]" if turn.get('targeted_agent') else ""
            story.append(Paragraph(f"<b>{speaker}{target}:</b> \"{msg}\"", style_body))
            story.append(Spacer(1, 3))
        
        story.append(Spacer(1, 6))
        story.append(Paragraph(f"<b>Strategic Mandate:</b> {d_synthesis.get('strategic_mandate', '')}", style_callout))

    # SECTION 6: 5x5 RISK MATRIX
    story.append(PageBreak())
    story.append(Paragraph("6. Risk Assessment Matrix", style_h1))
    risk_table_data = [
        [Paragraph("<b>Category</b>", style_bold), Paragraph("<b>Risk Title & Description</b>", style_bold), Paragraph("<b>Impact</b>", style_bold), Paragraph("<b>Likelihood</b>", style_bold), Paragraph("<b>Suggested Mitigation</b>", style_bold)]
    ]
    for r in risk_matrix:
        risk_table_data.append([
            Paragraph(f"<b>{r.get('category')}</b>", style_body),
            Paragraph(f"<b>{r.get('title')}</b><br/>{r.get('description')}", style_body),
            Paragraph(f"{r.get('impact')}/5", style_body),
            Paragraph(f"{r.get('likelihood')}/5", style_body),
            Paragraph(r.get("suggested_mitigation", "N/A"), style_body)
        ])
    t_risks = Table(risk_table_data, colWidths=[80, 160, 45, 55, 190])
    t_risks.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_card_bg),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOX', (0, 0), (-1, -1), 0.5, c_border),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, c_border),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_risks)
    story.append(Spacer(1, 14))

    # SECTION 7: RECOMMENDED ACTION PLAN
    story.append(Paragraph("7. Action Plan & Roadmap", style_h1))
    
    # 7 Days
    story.append(Paragraph("<b>Next 7 Days (Immediate Setup & Legal Validation):</b>", style_h2))
    for item in action_plan.get("seven_days", []):
        story.append(Paragraph(f"• [<b>{item.get('owner_role')}</b>] <b>{item.get('title')}:</b> {item.get('task')}", style_body))
    story.append(Spacer(1, 6))

    # 30 Days
    story.append(Paragraph("<b>Next 30 Days (Pilot Testing & Non-Dilutive Capital):</b>", style_h2))
    for item in action_plan.get("thirty_days", []):
        story.append(Paragraph(f"• [<b>{item.get('owner_role')}</b>] <b>{item.get('title')}:</b> {item.get('task')}", style_body))
    story.append(Spacer(1, 6))

    # 90 Days
    story.append(Paragraph("<b>Next 90 Days (Unit Economics & Fundraising):</b>", style_h2))
    for item in action_plan.get("ninety_days", []):
        story.append(Paragraph(f"• [<b>{item.get('owner_role')}</b>] <b>{item.get('title')}:</b> {item.get('task')}", style_body))
    story.append(Spacer(1, 14))

    # SECTION 8: RAG KNOWLEDGE CORPUS CITATIONS
    if rag_sources:
        story.append(Paragraph("8. Contextual RAG Knowledge Grounding", style_h1))
        story.append(Paragraph("Statutory schemes and ecosystem reference documents utilized during multi-agent evaluation:", style_body))
        story.append(Spacer(1, 4))
        for src in rag_sources:
            story.append(Paragraph(f"<b>{src.get('title')}</b> ({src.get('category')}) — Relevance: {src.get('relevance_score')}%", style_bold))
            story.append(Paragraph(f"<i>Excerpt: {src.get('excerpt')}</i>", style_callout))
            story.append(Spacer(1, 4))

    doc.build(story)
    buffer.seek(0)
    return buffer
