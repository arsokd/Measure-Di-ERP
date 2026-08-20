import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

function buildDemoGuidePDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm
  const pageWidth = doc.internal.pageSize.getWidth();   // 210 mm
  const margin = 14;
  const contentWidth = pageWidth - (margin * 2); // 182 mm
  let y = margin;

  function checkNewPage(neededHeight = 14) {
    if (y + neededHeight > pageHeight - margin - 10) {
      addFooter();
      doc.addPage();
      y = margin + 12;
      addHeader();
    }
  }

  function addHeader() {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Measure DI Technologies -- RevOps Enterprise Operating Manual & SOP Guide', margin, margin - 3);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, margin - 1, pageWidth - margin, margin - 1);
  }

  function addFooter() {
    const pageNum = doc.internal.getNumberOfPages();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${pageNum}`, pageWidth - margin - 12, pageHeight - 8);
    doc.text('CONFIDENTIAL -- Measure DI RevOps Enterprise Standard Operating Procedures & User Guide (v3.0)', margin, pageHeight - 8);
  }

  // ==========================================
  // 1. COVER & HEADER BANNER
  // ==========================================
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, y, contentWidth, 46, 'F');

  // Accent Brand Strip
  doc.setFillColor(152, 43, 104); // #982B68
  doc.rect(margin, y, 4, 46, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('Measure DI Technologies', margin + 9, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(56, 189, 248); // sky-400
  doc.text('Enterprise RevOps Platform & Standard Operating Procedures (SOP v3.0)', margin + 9, y + 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text('Comprehensive Operational Manual, Role-Based Training & Full 27-Module Navigation Architecture', margin + 9, y + 32);
  doc.text('Complete Separation of Capital Equipment Sales and Service & Quality Revenue Engines', margin + 9, y + 39);

  y += 52;

  // Metadata Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('Document Metadata & Release Governance:', margin + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('- Core Architecture: Overview -> Sales (Equipment) -> Service & Quality (AMC/Parts) -> Finance -> HR -> Performance', margin + 5, y + 11.5);
  doc.text('- Strict Segregation: Capital Equipment deals vs Service Tickets, AMC Lifecycle (Leads->Quotes->Orders->Invoices) & Spares', margin + 5, y + 16.5);
  doc.text('- Target Audience: Managing Director, VP RevOps, Commercial Managers, Service Engineers, Finance & HR Executives', margin + 5, y + 21.5);

  y += 32;

  // ==========================================
  // 2. MAIN NAVIGATION HIERARCHY (27 MODULES)
  // ==========================================
  checkNewPage(22);
  doc.setFillColor(152, 43, 104); // #982B68
  doc.rect(margin, y, 4, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Complete Navigation Map & Workspace Hierarchy (27 Modules)', margin + 7, y + 7);
  y += 15;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text('Measure DI RevOps is architected into 6 distinct domain menus and 27 modular workspaces to guarantee strict operational separation between Capital Equipment Sales and Service & Quality lifecycle:', margin, y);
  y += 8;

  // DRAW VISUAL SIDEBAR DIAGRAM (2 Columns)
  const sidebarWidth = contentWidth;
  const sidebarHeight = 136;
  checkNewPage(sidebarHeight + 10);

  doc.setFillColor(15, 23, 42); // slate-950
  doc.roundedRect(margin, y, sidebarWidth, sidebarHeight, 3, 3, 'F');

  // Top Title Bar of Diagram
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin, y, sidebarWidth, 9, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('MEASURE DI REVOPS -- 27-MODULE SYSTEM DIRECTORY & WORKSPACE MATRIX', margin + 6, y + 6);

  let sbY = y + 14;
  const col1X = margin + 6;
  const col2X = margin + 94;

  const navMapCol1 = [
    {
      cat: 'OVERVIEW',
      color: [226, 131, 189],
      items: ['1. Executive Dashboard (dashboard.html)']
    },
    {
      cat: 'SALES & REVENUE (EQUIPMENT ONLY)',
      color: [52, 211, 153],
      items: [
        '2. Equipment Sales Leads (leads.html)',
        '3. Equipment Quotations (quotations.html)',
        '4. Equipment Orders & POs (orders.html)',
        '5. Equipment Invoices (invoices.html)',
        '6. Payments & Collections (payments.html)',
        '7. Master Data & Bulk Upload (master-data.html)',
        '8. Audit & Activity Trail (audit-logs.html)'
      ]
    },
    {
      cat: 'SERVICE & QUALITY (DEDICATED REVENUE HUB)',
      color: [251, 191, 36],
      items: [
        '9. Service Tickets & QC (service-tickets.html)',
        '10. AMC Registration & Monitoring (amc-contracts.html)',
        '11. Service & AMC Leads (service-leads.html)',
        '12. AMC Quotations & Proposals (amc-quotes.html)',
        '13. AMC Order Registration (amc-orders.html)',
        '14. AMC Invoice Generation (amc-invoices.html)',
        '15. Parts Sales Revenue Model (parts-sales.html)',
        '16. Warranty Management & Claims (warranty-management.html)'
      ]
    }
  ];

  const navMapCol2 = [
    {
      cat: 'FINANCE & LEDGER',
      color: [129, 140, 248],
      items: [
        '17. Expenses & Profit Center (expenses.html)',
        '18. Payroll & CTC (payroll.html)'
      ]
    },
    {
      cat: 'PEOPLE & HR',
      color: [56, 189, 248],
      items: [
        '19. Employee Directory & Roster (employees.html)',
        '20. Attendance & Leaves (attendance.html)',
        '21. My Team Workspace (my-team.html)'
      ]
    },
    {
      cat: 'PERFORMANCE & STRATEGY',
      color: [244, 114, 182],
      items: [
        '22. My Scorecard (my-scorecard.html)',
        '23. Daily Work / DWM (dwm.html)',
        '24. KRAs & Target Metrics (kra-targets.html)',
        '25. Performance Reviews (reviews.html)',
        '26. Annual Operating Plan / AOP (aop-targets.html)',
        '27. Standard Operating Procedures / SOP (sop.html)'
      ]
    },
    {
      cat: 'DOCUMENTATION & ANALYTICS',
      color: [167, 139, 250],
      items: [
        'Executive Reports & PDF Guide (reports.html / user-guide.html)'
      ]
    }
  ];

  function renderNavCol(items, startX) {
    let currentY = sbY;
    items.forEach(sec => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(sec.color[0], sec.color[1], sec.color[2]);
      doc.text(`[ ${sec.cat} ]`, startX, currentY);
      currentY += 4;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(226, 232, 240);
      sec.items.forEach(it => {
        doc.text(`  * ${it}`, startX, currentY);
        currentY += 3.6;
      });
      currentY += 1.5;
    });
  }

  renderNavCol(navMapCol1, col1X);
  renderNavCol(navMapCol2, col2X);

  y += sidebarHeight + 10;

  // ==========================================
  // 3. COMPLETE STANDARD OPERATING PROCEDURES (SOP)
  // ==========================================
  checkNewPage(24);
  doc.setFillColor(152, 43, 104);
  doc.rect(margin, y, 4, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Standard Operating Procedures (SOP) -- Role-Based Operational Manual', margin + 7, y + 7);
  y += 15;

  const sopSections = [
    {
      title: 'SOP 1: Day 1 Onboarding & Daily Routine Cadence (Every Employee)',
      code: 'HR-DWM-SOP-01',
      color: [244, 114, 182],
      steps: [
        { name: '09:00 AM - Punch In & Location Tagging', path: 'attendance.html', desc: 'Log in to Attendance & Leaves. Choose work mode (Office, Field/Site, WFH). Click "Punch In" to timestamp your shift. Half-day and leave requests must be logged 24 hours in advance.' },
        { name: '09:15 AM - DWM Morning Task Commitment', path: 'dwm.html', desc: 'Open Daily Work Management. Select active employee session. Plan 3 to 6 discrete tasks for the day, assigning estimated hours and linking to specific Projects, Client Accounts, or Service Tickets.' },
        { name: 'Full-Day Special Assignment Coverage', path: 'dwm.html', desc: 'If attending Full-Day Client Training, Emergency Breakdown Site Visits, or ISO/NABL Audits, select "Special Assignment" to be awarded 100% daily productivity automatically.' },
        { name: '06:00 PM - Evening Actuals & Scorecard Check', path: 'dwm.html / my-scorecard.html', desc: 'Mark completed tasks with actual hours and notes. System computes real-time daily efficiency. View My Scorecard to review achievement ratings against quarterly KRA targets.' }
      ]
    },
    {
      title: 'SOP 2: Capital Equipment Sales Pipeline (Lead-to-Cash Lifecycle)',
      code: 'SALES-COMM-SOP-02',
      color: [52, 211, 153],
      steps: [
        { name: 'Step 1: Lead Ingestion & Qualification', path: 'leads.html', desc: 'Capture equipment inquiries for Projects, Onboard Weighing, and Crane Scales. Assign Deal Owner, Client Contact, Vertical, and expected closing date. Filter by 5 pipeline stages.' },
        { name: 'Step 2: Quotation Builder & Discount Approvals', path: 'quotations.html', desc: 'Create itemized quote linking Lead. System auto-calculates gross subtotal and GST. Discounts >15% automatically flag for Commercial Head approval; discounts >25% require Managing Director authorization.' },
        { name: 'Step 3: Purchase Order Booking & SLA Milestone Split', path: 'orders.html', desc: 'Upon client PO receipt, register Order with PO number, PO date, payment milestone schedule, and delivery SLAs. Reconcile quotation variance if final PO differs.' },
        { name: 'Step 4: Commercial Invoicing & Senior Director Sign-off', path: 'invoices.html', desc: 'Finance raises GST Tax Invoices against milestones. Invoices >Rs. 10 Lakhs require Senior / Director authorization before official client dispatch and PDF download.' },
        { name: 'Step 5: Payment Realization & Bank Guarantee Tracking', path: 'payments.html', desc: 'Accounts records collections against invoice numbers. Track Bank Guarantees (BG/PG), Retention clauses, and Director-authorized bad debt adjustments.' }
      ]
    },
    {
      title: 'SOP 3: Service Ticket Raising & Quality SLA Governance',
      code: 'SRV-TICKET-SOP-03',
      color: [251, 191, 36],
      steps: [
        { name: 'Step 1: Ticket Ingestion & Cascading Equipment Lookup', path: 'service-tickets.html', desc: 'Customer reports issue. Select Client from Master List -> system cascades and filters active Equipment Models and installed Serial Numbers. Select complaint category.' },
        { name: 'Step 2: Repeat Complaint Warning Engine', path: 'service-tickets.html', desc: 'If the selected Serial Number had a ticket in the last 60 days, system displays an automated Red Warning Banner highlighting recurring quality/component failure.' },
        { name: 'Step 3: Live Pop-up Notifications to Assigned Engineers', path: 'auth-guard.js', desc: 'Assigning a ticket to a field engineer immediately triggers an urgent floating bottom-right notification on their workspace across all pages until reviewed.' },
        { name: 'Step 4: Resolution Verification & QC Sign-off', path: 'service-tickets.html', desc: 'Engineer performs on-site inspection, uploads root cause and action taken, replaces parts if required, and closes ticket within mandatory SLA window.' }
      ]
    },
    {
      title: 'SOP 4: Service & AMC Revenue Hub (Contracts, Quotes, Orders & Invoices)',
      code: 'AMC-REV-SOP-04',
      color: [251, 191, 36],
      steps: [
        { name: 'Step 1: Service & AMC Leads Funnel', path: 'service-leads.html', desc: 'Dedicated funnel for AMC renewals, warranty expiry conversions, calibration calls, and breakdown inquiries. Completely segregated from capital equipment sales.' },
        { name: 'Step 2: AMC Quotations & Proposal Engine', path: 'amc-quotes.html', desc: 'Build Comprehensive (includes parts) or Non-Comprehensive (labor only) proposals with quarterly PM visit commitments, response time SLAs, and automatic SAC 998717 taxation.' },
        { name: 'Step 3: AMC Order Booking & Contract Activation', path: 'amc-orders.html / amc-contracts.html', desc: 'Client signs AMC proposal -> register AMC Order. Generates official AMC Contract in registry with automated quarterly PM visit schedules and renewal countdowns.' },
        { name: 'Step 4: AMC Milestone Invoice Generation', path: 'amc-invoices.html', desc: 'Finance issues quarterly advance AMC invoices (Q1-Q4) with SAC 998717 maintenance service codes and tracks cash realization.' }
      ]
    },
    {
      title: 'SOP 5: Spare Parts Sales & High-Margin Revenue Engine',
      code: 'PARTS-REV-SOP-05',
      color: [251, 191, 36],
      steps: [
        { name: 'Step 1: Parts Catalog & Gross Margin Intelligence', path: 'parts-sales.html', desc: 'Catalog of critical spare parts (Load Cells, Indicators, Hydraulic Sensors, Junction Boxes, Cables) with COGS, Selling Price, Gross Margin %, and HSN codes.' },
        { name: 'Step 2: Fast-Moving Inventory & Direct Spares Order', path: 'parts-sales.html', desc: 'Generate rapid spare parts supply orders with direct customer invoicing and immediate warehouse dispatch tracking.' },
        { name: 'Step 3: Service-to-Spares Upselling', path: 'parts-sales.html', desc: 'Field engineers tag worn-out parts during routine PM visits and automatically generate parts quotation leads for the customer.' }
      ]
    },
    {
      title: 'SOP 6: Warranty Management & RMA Claims',
      code: 'WARRANTY-SOP-06',
      color: [251, 191, 36],
      steps: [
        { name: 'Step 1: Installed Base Warranty Registry', path: 'warranty-management.html', desc: 'Tracks warranty periods (12 to 24 months) across all delivered equipment, serial numbers, customer plants, and delivery dates.' },
        { name: 'Step 2: Warranty Claim & RMA Processing', path: 'warranty-management.html', desc: 'Process Return Material Authorizations (RMA) for factory repair or replacement under warranty with vendor pass-through tracking.' },
        { name: 'Step 3: 1-Click Conversion to AMC Proposal', path: 'warranty-management.html -> amc-quotes.html', desc: 'When equipment enters the 60-day warranty expiry window, 1-click generates an AMC quotation proposal for seamless recurring revenue capture.' }
      ]
    },
    {
      title: 'SOP 7: Financial Accounting, Expenses & Payroll Governance',
      code: 'FIN-GOV-SOP-07',
      color: [129, 140, 248],
      steps: [
        { name: 'Multi-Project Expense Splitting', path: 'expenses.html', desc: 'Record travel claims, operational expenses, and direct material bills. Allocate costs across multiple project accounts with receipt attachments.' },
        { name: 'Payroll & Automated LOP Calculation', path: 'payroll.html', desc: 'Monthly salary disbursement engine. Pulls attendance punch logs to calculate automated Loss of Pay (LOP), PF/ESI deductions, and net payouts.' },
        { name: 'Profit Center Analytics & Operating Margins', path: 'expenses.html / dashboard.html', desc: 'Real-time profit center analysis matching project revenue against direct expenses to compute exact project gross and net margins.' }
      ]
    },
    {
      title: 'SOP 8: Enterprise Master Data & Bulk CSV Upload Center',
      code: 'DATA-BULK-SOP-08',
      color: [52, 211, 153],
      steps: [
        { name: 'Master Data Repositories', path: 'master-data.html', desc: 'Centralized repository for Clients Master (GSTIN, Terms), Projects Master, Spare Parts & Products Master, and Bank Master details.' },
        { name: 'Chunked Batch CSV Import', path: 'master-data.html', desc: 'Bulk import clients, products, or historical invoices in batch chunks with automated validation, deduplication, and error reporting.' },
        { name: 'Universal System Data Backup', path: 'master-data.html / auth-guard.js', desc: 'Export full CSV data backups for any collection across all 200 employee records with single-click archive creation.' }
      ]
    },
    {
      title: 'SOP 9: Director & Super Admin Enterprise Audit Logging',
      code: 'AUDIT-LEAD-SOP-09',
      color: [15, 23, 42],
      steps: [
        { name: 'Immutable Activity Ledger', path: 'audit-logs.html', desc: 'Universal audit trail capturing every create, update, approval, and delete action across all 27 modules with exact timestamps and actor IP/IDs.' },
        { name: 'Before vs After Field Diffs', path: 'audit-logs.html', desc: 'View granular field-by-field before and after modification changes (e.g. quote discount changes, salary edits, invoice status changes).' },
        { name: 'Restricted Access Control', path: 'audit-logs.html', desc: 'Strictly restricted to Managing Director and Super Admin roles to guarantee total organizational compliance and tamper-proof governance.' }
      ]
    }
  ];

  sopSections.forEach(sop => {
    checkNewPage(42);
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, 'FD');

    doc.setFillColor(sop.color[0], sop.color[1], sop.color[2]);
    doc.roundedRect(margin, y, 3, 8, 1.5, 1.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(sop.title, margin + 6, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`[ ${sop.code} ]`, pageWidth - margin - 35, y + 5.5);

    y += 11;

    sop.steps.forEach((st, idx) => {
      checkNewPage(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 58, 138);
      doc.text(`${idx + 1}. ${st.name}`, margin + 3, y);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(152, 43, 104);
      doc.text(`[ ${st.path} ]`, pageWidth - margin - 45, y);
      y += 4;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.setTextColor(71, 85, 105);
      const splitDesc = doc.splitTextToSize(st.desc, contentWidth - 8);
      doc.text(splitDesc, margin + 5, y);
      y += (splitDesc.length * 3.4) + 2.5;
    });

    y += 4;
  });

  // ==========================================
  // 4. SEQUENTIAL DEMONSTRATION SCRIPT & UI MOCKUPS
  // ==========================================
  checkNewPage(24);
  doc.setFillColor(152, 43, 104);
  doc.rect(margin, y, 4, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Sequential Client Demonstration Script & Screen Walkthroughs', margin + 7, y + 7);
  y += 15;

  function drawUIMockup(x, curY, width, height, title, subtitle, kpis, layoutType) {
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(x, curY, width, height, 2, 2, 'FD');

    // Header bar of screen mockup
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(x, curY, width, 7.5, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text(`SCREEN MOCKUP: ${title}`, x + 4, curY + 5.2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(subtitle, x + width - 52, curY + 5.2);

    // KPI Cards inside Mockup
    if (kpis && kpis.length > 0) {
      const cardW = (width - 10 - (kpis.length - 1) * 3) / kpis.length;
      kpis.forEach((k, idx) => {
        const kX = x + 5 + idx * (cardW + 3);
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(kX, curY + 10, cardW, 10, 1.5, 1.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5.5);
        doc.setTextColor(100, 116, 139);
        doc.text(k.label, kX + 2, curY + 14);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(15, 23, 42);
        doc.text(k.val, kX + 2, curY + 18.5);
      });
    }

    // Chart / Table Area Placeholder in Mockup
    const bodyY = curY + 22;
    const bodyH = height - 24;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x + 5, bodyY, width - 10, bodyH, 1.5, 1.5, 'FD');

    if (layoutType === 'chart') {
      doc.setFillColor(59, 130, 246);
      doc.rect(x + 12, bodyY + 5, 8, bodyH - 8, 'F');
      doc.setFillColor(99, 102, 241);
      doc.rect(x + 24, bodyY + 3, 8, bodyH - 6, 'F');
      doc.setFillColor(16, 185, 129);
      doc.rect(x + 36, bodyY + 2, 8, bodyH - 5, 'F');
      doc.setFillColor(245, 158, 11);
      doc.rect(x + 48, bodyY + 6, 8, bodyH - 9, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(71, 85, 105);
      doc.text('Performance Trend & Governance Analytics Visualization', x + 62, bodyY + 7);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.text('* Dynamic period scaling across WTD, MTD, Q1-Q4, H1-H2, Full Year.', x + 62, bodyY + 11);
      doc.text('* Multi-tier authorization gates embedded across billing and contracts.', x + 62, bodyY + 14);
    } else {
      doc.setFillColor(241, 245, 249);
      doc.rect(x + 7, bodyY + 2, width - 14, 3.8, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5.8);
      doc.setTextColor(30, 41, 59);
      doc.text('ID / Entity Name         Category / Stage         Amount (INR) / Rate       Approval / Owner', x + 9, bodyY + 4.8);

      for (let r = 0; r < 3; r++) {
        const rY = bodyY + 6.5 + r * 3.5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(5.2);
        doc.setTextColor(100, 116, 139);
        doc.text(`REC-${101 + r} -- Active Item       Verified / Active        Rs. ${(r + 1) * 4.2} Lakhs      Authorized Lead`, x + 9, rY + 2.5);
      }
    }
  }

  const demoModules = [
    {
      category: 'OVERVIEW',
      submenu: 'Executive Dashboard',
      url: 'dashboard.html',
      description: 'The executive command center displaying macro revenue metrics, deal conversion funnels, expense burn rates, profit margins, and department attendance.',
      kpis: [{ label: 'TOTAL REVENUE', val: 'Rs. 2,450 L' }, { label: 'ACTIVE PIPELINE', val: 'Rs. 890 L' }, { label: 'NET MARGIN', val: '24.8%' }],
      mockupType: 'chart',
      talkPoints: [
        'Highlight top KPI metrics (Total Invoiced Revenue, Cash Realized, Operating Expenses, Net Margin %).',
        'Demonstrate Period Filter (WTD, MTD, Q1-Q4, H1-H2, FY 2026-27) with mathematical ratio auto-scaling.',
        'Show pipeline conversion funnel with live deal status and business vertical breakdowns.'
      ]
    },
    {
      category: 'SALES & REVENUE (EQUIPMENT)',
      submenu: 'Equipment Sales Leads & CRM',
      url: 'leads.html',
      description: 'Capital equipment deal tracker spanning Projects, Onboard Weighing, and Crane Scales through a 5-stage pipeline.',
      kpis: [{ label: 'TOTAL LEADS', val: '48 Active' }, { label: 'PIPELINE VAL', val: 'Rs. 420 L' }, { label: 'WIN RATE', val: '38.5%' }],
      mockupType: 'table',
      talkPoints: [
        'Filter leads by Sales Stage and Business Vertical (Projects, Onboard, Crane).',
        'Demonstrate deal creation modal with auto-calculated weighted pipeline probabilities.',
        'Show 1-click generation of quotations directly from qualified lead records.'
      ]
    },
    {
      category: 'SALES & REVENUE (EQUIPMENT)',
      submenu: 'Equipment Quotations & Approvals',
      url: 'quotations.html',
      description: 'Itemized quotation builder with gross margin checks, tiered discount approval triggers (Head & MD), and professional PDF generation.',
      kpis: [{ label: 'ACTIVE QUOTES', val: '32 Issued' }, { label: 'PENDING APPROVAL', val: '4 Critical' }, { label: 'CONVERTED', val: '45%' }],
      mockupType: 'table',
      talkPoints: [
        'Build structured quotes with automated line-item GST calculations and version revision history.',
        'Trigger discount threshold governance (>15% Head sign-off, >25% MD sign-off).',
        'Generate printable PDF quotation with terms, payment milestones, and digital verification stamp.'
      ]
    },
    {
      category: 'SALES & REVENUE (EQUIPMENT)',
      submenu: 'Equipment Commercial Invoices',
      url: 'invoices.html',
      description: 'Commercial & GST tax invoicing governance managed by Finance with Senior Director approval gates for high-value billing.',
      kpis: [{ label: 'BILLED REVENUE', val: 'Rs. 1,840 L' }, { label: 'COLLECTED CASH', val: 'Rs. 1,420 L' }, { label: 'PENDING APPROVAL', val: '3 Invoices' }],
      mockupType: 'table',
      talkPoints: [
        'Review Senior Approval banner for invoices awaiting Director authorization before client dispatch.',
        'Track payment due dates, TDS deductions, and milestone percentage billings.',
        'Generate formatted Tax Invoices with SAC/HSN codes and statutory contract safeguards.'
      ]
    },
    {
      category: 'SERVICE & QUALITY',
      submenu: 'Service Tickets & QC Hub',
      url: 'service-tickets.html',
      description: 'Ticket management engine with cascading customer equipment lookup, 60-day repeat complaint warnings, and engineer live alerts.',
      kpis: [{ label: 'OPEN TICKETS', val: '14 Active' }, { label: 'SLA COMPLIANCE', val: '94.2%' }, { label: 'REPEAT ALERTS', val: '2 Critical' }],
      mockupType: 'table',
      talkPoints: [
        'Demonstrate 2-tier cascading dropdown: Customer -> Equipment Model -> Serial Number.',
        'Show instant Red Alert Banner when selecting a Serial Number with repeat complaints in 60 days.',
        'Trigger live popup alert on assigned engineer screens across the entire application.'
      ]
    },
    {
      category: 'SERVICE & QUALITY',
      submenu: 'Service & AMC Leads Hub',
      url: 'service-leads.html',
      description: 'Dedicated inbound inquiry funnel for AMC renewals, breakdown callouts, calibration visits, and spare parts requests.',
      kpis: [{ label: 'SERVICE LEADS', val: '26 Open' }, { label: 'AMC PIPELINE', val: 'Rs. 68.5 L' }, { label: 'WIN RATE', val: '52%' }],
      mockupType: 'table',
      talkPoints: [
        'Segregated from equipment sales to ensure focused tracking of service recurring revenues.',
        'Track service types (Comprehensive AMC, Non-Comprehensive AMC, Calibrations, Spares).',
        '1-click conversion to AMC Quotation or direct field service dispatch.'
      ]
    },
    {
      category: 'SERVICE & QUALITY',
      submenu: 'AMC Quotations & Proposals',
      url: 'amc-quotes.html',
      description: 'Comprehensive & Non-Comprehensive AMC proposal generator with quarterly PM visit schedules and SAC 998717 maintenance taxation.',
      kpis: [{ label: 'AMC QUOTES', val: '18 Active' }, { label: 'ANNUAL VALUE', val: 'Rs. 44 L' }, { label: 'CONFIRMATION', val: '65%' }],
      mockupType: 'table',
      talkPoints: [
        'Select Comprehensive vs Non-Comprehensive tiers with automatic parts inclusion rules.',
        'Configure quarterly preventive maintenance visit commitments and emergency response SLAs.',
        'Generate formal AMC proposal agreements with payment milestone terms.'
      ]
    },
    {
      category: 'SERVICE & QUALITY',
      submenu: 'AMC Registration & Monitoring',
      url: 'amc-contracts.html',
      description: 'Contract registry tracking active AMCs, quarterly PM visit execution, SLA adherence, and 60-day renewal countdowns.',
      kpis: [{ label: 'ACTIVE AMCS', val: '42 Contracts' }, { label: 'ANNUAL ARR', val: 'Rs. 112 L' }, { label: 'UPCOMING PMS', val: '8 This Month' }],
      mockupType: 'table',
      talkPoints: [
        'Monitor contract status (Active, Expiring Soon, Expired, Renewed).',
        'Track quarterly PM visit schedules (Q1 to Q4) with engineer completion sign-offs.',
        'Automated 60-day expiry alert to initiate early contract renewals and maintain ARR.'
      ]
    },
    {
      category: 'SERVICE & QUALITY',
      submenu: 'Parts Sales Revenue Model',
      url: 'parts-sales.html',
      description: 'High-margin replacement spare parts catalog with COGS, gross margins, inventory tracking, and direct supply dispatch.',
      kpis: [{ label: 'PARTS REVENUE', val: 'Rs. 84.5 L' }, { label: 'AVG MARGIN', val: '46.2%' }, { label: 'FAST MOVING', val: '12 SKUs' }],
      mockupType: 'table',
      talkPoints: [
        'Analyze parts profitability matrix with unit costs, selling prices, and margin percentages.',
        'Process rapid replacement parts orders during breakdown emergencies.',
        'View top fast-moving parts (Load cells, digital indicators, junction boards).'
      ]
    },
    {
      category: 'SERVICE & QUALITY',
      submenu: 'Warranty Management & Claims',
      url: 'warranty-management.html',
      description: 'Installed base warranty tracking, Return Material Authorization (RMA) claims, and 1-click AMC proposal conversion.',
      kpis: [{ label: 'IN WARRANTY', val: '86 Units' }, { label: 'EXPIRING (60D)', val: '12 Units' }, { label: 'RMA CLAIMS', val: '3 Open' }],
      mockupType: 'table',
      talkPoints: [
        'Track equipment warranty duration from commissioning and installation dates.',
        'Manage RMA replacement claims with manufacturer and supplier warranty pass-through.',
        'Click "Convert to AMC" on expiring units to instantly populate a renewal proposal.'
      ]
    },
    {
      category: 'PERFORMANCE & STRATEGY',
      submenu: 'Daily Work Management (DWM)',
      url: 'dwm.html',
      description: 'Daily task commitment and productivity engine comparing morning plans against evening actuals with special assignment credits.',
      kpis: [{ label: 'DWM SUBMISSIONS', val: '96% Rate' }, { label: 'AVG EFFICIENCY', val: '91.4%' }, { label: 'TASKS LOGGED', val: '184 Today' }],
      mockupType: 'table',
      talkPoints: [
        'Demonstrate session switcher: view DWM for any of the 200 staff members.',
        'Morning plan vs evening actuals calculation with automated task completion scoring.',
        'Full-Day Special Assignment credits for client training, emergency site visits, and audits.'
      ]
    },
    {
      category: 'ADMIN & GOVERNANCE',
      submenu: 'Universal Audit & Activity Trail',
      url: 'audit-logs.html',
      description: 'Tamper-proof immutable ledger capturing every system update, quotation revision, salary edit, and deletion with user diffs.',
      kpis: [{ label: 'TOTAL LOGS', val: '4,280 Records' }, { label: 'ACTIONS TODAY', val: '142 Events' }, { label: 'SECURITY ACCESS', val: 'MD / Super Admin' }],
      mockupType: 'table',
      talkPoints: [
        'Filter audit trail by Module (Sales, Service, Invoices, HR, DWM, Master Data) and Action Type.',
        'View granular Before vs After field diffs showing exact data modifications and user IDs.',
        'Guarantees 100% regulatory compliance, financial integrity, and accountability.'
      ]
    }
  ];

  demoModules.forEach(mod => {
    checkNewPage(56);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 54, 2, 2, 'FD');

    // Accent line
    doc.setFillColor(152, 43, 104);
    doc.roundedRect(margin, y, 3, 54, 2, 2, 'F');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`[ ${mod.category} ] -- ${mod.submenu}`, margin + 6, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(152, 43, 104);
    doc.text(mod.url, pageWidth - margin - 35, y + 5.5);

    // Description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(71, 85, 105);
    const splitD = doc.splitTextToSize(mod.description, contentWidth - 12);
    doc.text(splitD, margin + 6, y + 10.5);

    // Mini UI Mockup
    drawUIMockup(margin + 6, y + 15, 82, 34, mod.submenu, mod.url, mod.kpis, mod.mockupType);

    // Demonstration Talking Points
    const tpX = margin + 92;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 58, 138);
    doc.text('Key Demonstration & SOP Verification Points:', tpX, y + 17);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(51, 65, 85);
    let tpY = y + 22;
    mod.talkPoints.forEach(tp => {
      const splitTp = doc.splitTextToSize(`* ${tp}`, contentWidth - 96);
      doc.text(splitTp, tpX, tpY);
      tpY += (splitTp.length * 3.2) + 1.2;
    });

    y += 58;
  });

  // ==========================================
  // 5. EXECUTIVE SUMMARY & SLIDE PRESENTATION
  // ==========================================
  checkNewPage(24);
  doc.setFillColor(152, 43, 104);
  doc.rect(margin, y, 4, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('4. Executive Presentation & Boardroom Demonstration Deck', margin + 7, y + 7);
  y += 15;

  const slides = [
    {
      title: 'Slide 1: Executive Overview & Dual Engine Architecture',
      header: 'Unifying Capital Equipment Sales & Recurring Service Operations',
      bullets: [
        'Dual Revenue Engines: Strict segregation of Capital Projects (one-off capex) and Service/AMC/Parts (recurring high-margin ARR).',
        'Full 27-Module Ecosystem: Complete operational workspace connecting Leads, Quotations, Orders, Invoices, Service, HR, and Ledger.',
        'Zero Manual Consolidation: Automated real-time telemetry replacing slow spreadsheets with cloud-synced databases.'
      ]
    },
    {
      title: 'Slide 2: Service & Quality Operational Excellence',
      header: 'Eliminating Repeat Failures & Guaranteeing Quality SLAs',
      bullets: [
        'Cascading Equipment Master: Customer-to-model-to-serial number validation prevents inaccurate ticket entry.',
        '60-Day Repeat Complaint Detection: Automated red warning banners highlight persistent hardware/sensor failure patterns.',
        'Live Engineer Notifications: Floating popup alerts ensure zero service delays for critical client breakdowns.'
      ]
    },
    {
      title: 'Slide 3: High-Margin Recurring Revenue (AMC, Warranty & Spares)',
      header: 'Transforming Aftermarket Support into a Predictable Growth Driver',
      bullets: [
        'AMC Revenue Lifecycle: Dedicated AMC Leads -> Quotations -> Orders -> Invoices -> Registry Monitoring.',
        'Warranty-to-AMC Pipeline: Automatic 60-day expiry conversion captures recurring contracts from installed equipment.',
        'High-Margin Spares Catalog: Instant replacement ordering with gross margin intelligence and fast-moving inventory tracking.'
      ]
    },
    {
      title: 'Slide 4: Commercial Governance & Invoicing Controls',
      header: 'Protecting Gross Margins with Tiered Authorization Gates',
      bullets: [
        'Tiered Discount Approvals: Discounts >15% route to Commercial Head; discounts >25% require Managing Director authorization.',
        'Senior Invoicing Authorization: High-value commercial invoices require Director sign-off before client delivery.',
        'Statutory Contract Safeguards: Bank Guarantees (BG/PG), retention terms, and bad debt adjustments tracked centrally.'
      ]
    },
    {
      title: 'Slide 5: Workforce Productivity & Daily Work Management (DWM)',
      header: 'Connecting Daily Human Capital Effort Directly to Strategic Goals',
      bullets: [
        'Morning Plan vs Evening Actuals: Real-time calculation of daily completion percentage and task efficiency.',
        'Special Assignment Credits: Full-day client training, breakdown site visits, and audits grant 100% daily productivity.',
        'Transparent Scorecards: Objective quarterly achievement ratings feed directly into performance appraisal cycles.'
      ]
    },
    {
      title: 'Slide 6: Enterprise Governance, Security & Audit Logs',
      header: 'Tamper-Proof Audit Trails and Resilient Cloud Architecture',
      bullets: [
        'Immutable Audit Trail: Captures every update, quotation revision, invoice approval, and deletion with before/after diffs.',
        'Role-Based Access Control (RBAC): Super Admin, Admin, Manager, and Staff roles with granular page permissions.',
        'Dual Resilience: Dual offline LocalStorage + Firebase Firestore cloud synchronization for 100% uptime.'
      ]
    }
  ];

  slides.forEach(s => {
    checkNewPage(26);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(s.title, margin, y);
    y += 4.2;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 58, 138);
    doc.text(`Header: ${s.header}`, margin + 2, y);
    y += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    s.bullets.forEach(b => {
      doc.text(`* ${b}`, margin + 4, y);
      y += 4;
    });
    y += 3;
  });

  // Footer for all generated pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addHeader();
    addFooter();
  }

  // Save PDF outputs to workspace
  if (!fs.existsSync('./public')) {
    fs.mkdirSync('./public', { recursive: true });
  }

  const pdfOutput = doc.output('arraybuffer');
  const buffer = Buffer.from(pdfOutput);

  fs.writeFileSync('Measure_DI_RevOps_Client_Demo_Guide.pdf', buffer);
  fs.writeFileSync('public/Measure_DI_RevOps_Client_Demo_Guide.pdf', buffer);
  console.log('PDF Guide generated successfully with full 27-module hierarchy, SOPs, and demo scripts! File size:', buffer.length);
}

buildDemoGuidePDF();
