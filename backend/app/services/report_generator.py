import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_student_report(student_data: dict, file_path: str):
    """
    Generates a PDF report containing 10 sections using ReportLab.
    """
    doc = SimpleDocTemplate(file_path, pagesize=letter,
                            rightMargin=40, leftMargin=40,
                            topMargin=40, bottomMargin=40)
    
    styles = getSampleStyleSheet()
    title_style = styles['Title']
    h1_style = styles['Heading1']
    h1_style.textColor = colors.HexColor("#0f766e") # Teal-700
    h2_style = styles['Heading2']
    h2_style.textColor = colors.HexColor("#334155")
    normal_style = styles['Normal']
    normal_style.fontSize = 10
    
    elements = []
    
    # Title
    elements.append(Paragraph("EDUINSIGHT AI", title_style))
    elements.append(Paragraph("Student Intelligence Report", h2_style))
    elements.append(Spacer(1, 20))
    
    # 1. Student Overview
    elements.append(Paragraph("1. Student Overview", h1_style))
    overview_data = [
        ["Name", student_data.get('name', 'N/A')],
        ["Major", student_data.get('major', 'Computer Science')],
        ["Academic Year", str(student_data.get('academic_year', 'Year 3'))],
        ["Date Generated", datetime.now().strftime("%Y-%m-%d")]
    ]
    t_overview = Table(overview_data, colWidths=[150, 250])
    t_overview.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 1, colors.HexColor("#e2e8f0")),
        ('PADDING', (0,0), (-1,-1), 6)
    ]))
    elements.append(t_overview)
    elements.append(Spacer(1, 15))
    
    # 2. Academic Performance
    elements.append(Paragraph("2. Academic Performance", h1_style))
    acad_data = [
        ["Previous GPA", str(student_data.get('previous_gpa', 'N/A'))],
        ["Current GPA", str(student_data.get('current_gpa', 'N/A'))],
        ["Attendance", f"{student_data.get('attendance_pct', 0)}%"]
    ]
    t_acad = Table(acad_data, colWidths=[150, 250])
    t_acad.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 1, colors.HexColor("#e2e8f0")),
        ('PADDING', (0,0), (-1,-1), 6)
    ]))
    elements.append(t_acad)
    elements.append(Spacer(1, 15))
    
    # 3. Risk Prediction
    elements.append(Paragraph("3. Risk Prediction", h1_style))
    risk = student_data.get('risk_level', 'UNKNOWN')
    risk_color = colors.HexColor("#ef4444") if risk == "HIGH" else colors.HexColor("#10b981") if risk == "LOW" else colors.HexColor("#f59e0b")
    
    risk_para = Paragraph(f"<b>Current Risk Level:</b> <font color='{risk_color.hexval()}'>{risk}</font>", normal_style)
    elements.append(risk_para)
    elements.append(Paragraph(f"<b>Pass Probability:</b> {student_data.get('pass_probability', 0)}%", normal_style))
    elements.append(Spacer(1, 15))
    
    # 4. Expected Performance
    elements.append(Paragraph("4. Expected Performance", h1_style))
    elements.append(Paragraph(f"<b>Expected Final Marks:</b> {student_data.get('expected_marks', 'N/A')}/100", normal_style))
    elements.append(Paragraph(f"<b>Expected GPA:</b> {student_data.get('expected_gpa', 'N/A')}", normal_style))
    elements.append(Spacer(1, 15))
    
    # 5. Model Prediction (History)
    elements.append(Paragraph("5. Model Prediction History", h1_style))
    history = student_data.get('history', [])
    if history:
        hist_data = [["Semester", "Risk Level", "Improvement"]]
        for h in history:
            hist_data.append([h['semester'], h['risk'], h.get('improvement', 'N/A')])
        t_hist = Table(hist_data, colWidths=[130, 130, 140])
        t_hist.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#cbd5e1")),
            ('GRID', (0,0), (-1,-1), 1, colors.HexColor("#e2e8f0")),
            ('PADDING', (0,0), (-1,-1), 6)
        ]))
        elements.append(t_hist)
    else:
        elements.append(Paragraph("No historical data available.", normal_style))
    elements.append(Spacer(1, 15))
    
    # 6. Weak Subjects
    elements.append(Paragraph("6. Weak Subjects", h1_style))
    weak_subjects = student_data.get('weak_subjects', [])
    if weak_subjects:
        for subj in weak_subjects:
            elements.append(Paragraph(f"• {subj}", normal_style))
    else:
        elements.append(Paragraph("None detected.", normal_style))
    elements.append(Spacer(1, 15))
    
    # 7. Study Recommendation
    elements.append(Paragraph("7. Study Recommendation", h1_style))
    recommendations = student_data.get('recommendations', [])
    if recommendations:
        for rec in recommendations:
            elements.append(Paragraph(f"• {rec}", normal_style))
    else:
        elements.append(Paragraph("Keep up the good work!", normal_style))
    elements.append(Spacer(1, 15))
    
    # 8. Career Recommendation
    elements.append(Paragraph("8. Career Recommendation", h1_style))
    careers = student_data.get('careers', [])
    if careers:
        for c in careers:
            elements.append(Paragraph(f"• <b>{c['role']}</b> (Confidence: {c['confidence']}%)", normal_style))
    else:
        elements.append(Paragraph("No career data available.", normal_style))
    elements.append(Spacer(1, 15))
    
    # 9. Skill Gap
    elements.append(Paragraph("9. Skill Gap Analysis", h1_style))
    skill_gaps = student_data.get('skill_gaps', [])
    if skill_gaps:
        for gap in skill_gaps:
            elements.append(Paragraph(f"❌ {gap}", normal_style))
    else:
        elements.append(Paragraph("No major skill gaps identified.", normal_style))
    elements.append(Spacer(1, 15))
    
    # 10. Improvement Suggestions
    elements.append(Paragraph("10. Improvement Suggestions", h1_style))
    elements.append(Paragraph("To reach the next level, focus on completing the assigned study roadmap, practice the identified weak subjects, and actively engage in portfolio projects related to your recommended career.", normal_style))
    
    # Build PDF
    doc.build(elements)
    return file_path
