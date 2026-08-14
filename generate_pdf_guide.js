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
    doc.text('Measure DI Technologies -- RevOps Platform Operating Manual & Demonstration Guide', margin, margin - 3);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, margin - 1, pageWidth - margin, margin - 1);
  }

  function addFooter() {
    const pageNum = doc.internal.getNumberOfPages();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${pageNum}`, pageWidth - margin - 12, pageHeight - 8);
    doc.text('CONFIDENTIAL -- Comprehensive RevOps Operating Manual & Sequential Workflow Guide (v2.6)', margin, pageHeight - 8);
  }

  // --- COVER & HEADER BANNER ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, y, contentWidth, 44, 'F');

  // Accent Brand Strip
  doc.setFillColor(152, 43, 104); // #982B68
  doc.rect(margin, y, 4, 44, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('Measure DI Technologies', margin + 9, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(56, 189, 248); // sky-400
  doc.text('RevOps Client Demonstration & Operating Manual (v2.6)', margin + 9, y + 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text('Lead-to-Cash, Invoicing & Approvals, AR Adjustments, Master Bulk Import & DWM Productivity', margin + 9, y + 32);
  doc.text('Full End-to-End Enterprise Standard Operating Procedures (SOP) with Screen Mockups', margin + 9, y + 38);

  y += 50;

  // Metadata Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('Document Metadata & System Release Scope:', margin + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('- Core Architecture: Overview -> Sales & Revenue (Quotes, Invoices, Orders, AR) -> Service -> Finance -> People -> Performance -> Master Data', margin + 5, y + 11.5);
  doc.text('- Key Enhancements: Senior Invoicing Approvals, AR Adjustments / Bad Debt Write-Offs, Master Data CSV Bulk Upload & Special DWM Scoring', margin + 5, y + 16.5);
  doc.text('- Audience: Board of Directors, Managing Director, Dept Heads, Finance Controllers & Enterprise Users', margin + 5, y + 21.5);

  y += 32;

  // --- SECTION 1: SIDEBAR NAVIGATION MAP & SEQUENCE OVERVIEW ---
  checkNewPage(20);
  doc.setFillColor(30, 58, 138); // blue-900
  doc.rect(margin, y, 4, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 58, 138);
  doc.text('1. Main Navigation Hierarchy & Complete Menu Structure (19 Modules)', margin + 7, y + 7);
  y += 15;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text('The sidebar navigation is structured into 7 core functional menu sections and 19 sub-menu modules. Present the platform following this exact sequence for maximum client impact:', margin, y);
  y += 8;

  // DRAW VISUAL SIDEBAR DIAGRAM
  const sidebarWidth = contentWidth;
  const sidebarHeight = 112;
  checkNewPage(sidebarHeight + 10);

  doc.setFillColor(15, 23, 42); // slate-950 dark sidebar bg
  doc.roundedRect(margin, y, sidebarWidth, sidebarHeight, 3, 3, 'F');

  // Top Title Bar of Sidebar Diagram
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin, y, sidebarWidth, 9, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('SIDEBAR NAVIGATION MENU MAP -- COMPLETE 19-MODULE OPERATING WORKSPACE', margin + 6, y + 6);

  let sbY = y + 14;
  const col1X = margin + 6;
  const col2X = margin + 94;

  const navMapCol1 = [
    {
      cat: 'OVERVIEW',
      color: [226, 131, 189], // light magenta
      items: ['1. Executive Dashboard (dashboard.html)']
    },
    {
      cat: 'SALES & REVENUE (LEAD-TO-CASH & BILLING)',
      color: [52, 211, 153], // emerald
      items: [
        '2. Leads & Pipeline CRM (leads.html)',
        '3. Quotations & Discount Approvals (quotations.html)',
        '4. Invoices & Director Approvals (invoices.html)',
        '5. Orders & Contracts (orders.html)',
        '6. Payments & AR Write-Offs (payments.html)',
        '7. Master Data & Bulk Upload (master-data.html)'
      ]
    },
    {
      cat: 'SERVICE & QUALITY',
      color: [251, 191, 36], // amber
      items: ['8. Service Tickets & Quality SLA (service-tickets.html)']
    }
  ];

  const navMapCol2 = [
    {
      cat: 'FINANCE & LEDGER',
      color: [129, 140, 248], // indigo
      items: [
        '9. Expenses & Profit Center (expenses.html)',
        '10. Payroll & CTC (payroll.html)'
      ]
    },
    {
      cat: 'PEOPLE & HR',
      color: [56, 189, 248], // sky
      items: [
        '11. Employee Directory & Roster (employees.html)',
        '12. Attendance & Leaves (attendance.html)',
        '13. My Team Workspace (my-team.html)'
      ]
    },
    {
      cat: 'PERFORMANCE & STRATEGY',
      color: [244, 114, 182], // pink
      items: [
        '14. My Scorecard (my-scorecard.html)',
        '15. Daily Work / DWM & Productivity (dwm.html)',
        '16. KRAs & Target Metrics (kra-targets.html)',
        '17. Performance Reviews (reviews.html)',
        '18. Annual Operating Plan / AOP (aop-targets.html)'
      ]
    },
    {
      cat: 'DOCUMENTATION & ANALYTICS',
      color: [167, 139, 250], // purple
      items: [
        '19. Executive Reports & PDF Manual (reports.html / user-guide.html)'
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
      doc.setFontSize(7);
      doc.setTextColor(226, 232, 240);
      sec.items.forEach(it => {
        doc.text(`  * ${it}`, startX, currentY);
        currentY += 3.8;
      });
      currentY += 1.5;
    });
  }

  renderNavCol(navMapCol1, col1X);
  renderNavCol(navMapCol2, col2X);

  y += sidebarHeight + 8;

  // --- FUNCTION TO DRAW MINI UI MOCKUP SCREEN IN PDF ---
  function drawUIMockup(x, curY, width, height, title, subtitle, kpis, layoutType) {
    doc.setFillColor(241, 245, 249); // slate-100 bg
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
    doc.text(subtitle, x + width - 48, curY + 5.2);

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
      // Draw simulated bar chart bars
      doc.setFillColor(59, 130, 246); // blue
      doc.rect(x + 12, bodyY + 5, 8, bodyH - 8, 'F');
      doc.setFillColor(99, 102, 241); // indigo
      doc.rect(x + 24, bodyY + 3, 8, bodyH - 6, 'F');
      doc.setFillColor(16, 185, 129); // emerald
      doc.rect(x + 36, bodyY + 2, 8, bodyH - 5, 'F');
      doc.setFillColor(245, 158, 11); // amber
      doc.rect(x + 48, bodyY + 6, 8, bodyH - 9, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(71, 85, 105);
      doc.text('Performance Trend & Governance Analytics Visualization', x + 62, bodyY + 7);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.text('* Automated period scaling with live ratios across all 6 departments.', x + 62, bodyY + 11);
      doc.text('* Strict authorization gates & audit vouchers embedded across workflows.', x + 62, bodyY + 14);
    } else {
      // Draw simulated table rows
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
        doc.text(`REC-${101 + r} -- Active Item       Verified / Active        Rs. ${(r + 1) * 3.5} Lakhs      Authorized Lead`, x + 9, rY + 2.5);
      }
    }
  }

  // --- SECTION 2: DETAILED SEQUENTIAL MAIN MENU & SUB-MENU WALKTHROUGH ---
  checkNewPage(20);
  doc.setFillColor(30, 58, 138);
  doc.rect(margin, y, 4, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 58, 138);
  doc.text('2. Sequential Main Menu & Sub-Menu Demonstration Script (19 Modules)', margin + 7, y + 7);
  y += 15;

  const fullSequentialMenuData = [
    // --- CATEGORY 1: OVERVIEW ---
    {
      category: 'MAIN MENU 1: OVERVIEW',
      submenu: '1.1 Executive Dashboard',
      url: 'dashboard.html',
      description: 'The primary C-suite command center displaying macro revenue metrics, active pipeline funnels, monthly expenses, profit margins, and attendance compliance.',
      kpis: [{ label: 'TOTAL REVENUE', val: 'Rs. 2,450 L' }, { label: 'ACTIVE PIPELINE', val: 'Rs. 890 L' }, { label: 'PROFIT MARGIN', val: '24.8%' }],
      mockupType: 'chart',
      talkPoints: [
        'Point out top executive KPI cards (ARR, Active Deals, Operating Burn, Net Margin %).',
        'Demonstrate the Period Filter (WTD, MTD, Q1-Q4, H1-H2, Full Year) - highlight how target ratios scale mathematically.',
        'Show the Deal Pipeline Conversion Funnel with stage hover tooltips and vertical filter.'
      ]
    },

    // --- CATEGORY 2: SALES & REVENUE ---
    {
      category: 'MAIN MENU 2: SALES & REVENUE',
      submenu: '2.1 Leads & Pipeline CRM',
      url: 'leads.html',
      description: 'Commercial deal management tracking prospective leads across 5 stage funnels (Enquiry -> Qualified -> Quoted -> Negotiation -> Won).',
      kpis: [{ label: 'TOTAL LEADS', val: '48 Active' }, { label: 'QUOTED VALUE', val: 'Rs. 320 L' }, { label: 'WIN RATE', val: '38.5%' }],
      mockupType: 'table',
      talkPoints: [
        'Filter leads by Sales Stage and Business Vertical (Sales, Service/Parts, Projects).',
        'Click "Add New Lead" modal to demonstrate quick deal creation with probability weighting.',
        'Show owner assignments and target closure date tracking.'
      ]
    },
    {
      category: 'MAIN MENU 2: SALES & REVENUE',
      submenu: '2.2 Quotations & Discount Threshold Approvals',
      url: 'quotations.html',
      description: 'Structured proposal generator with automatic gross margin calculation, tiered discount approval triggers (Commercial Head & MD), revision history, and professional PDF exports.',
      kpis: [{ label: 'ACTIVE QUOTES', val: '28 Issued' }, { label: 'PENDING APPROVAL', val: '5 Critical' }, { label: 'CONVERSION', val: '42%' }],
      mockupType: 'table',
      talkPoints: [
        'Create itemized quotations linking Spare Parts or Equipment line items with automatic GST.',
        'Demonstrate Discount Threshold Governance: Discounts >15% automatically route to Commercial Head, >25% require Managing Director authorization.',
        'Generate printable PDF quotation with terms, payment milestones, and digital verification seal.'
      ]
    },
    {
      category: 'MAIN MENU 2: SALES & REVENUE',
      submenu: '2.3 Invoices & Director Approvals',
      url: 'invoices.html',
      description: 'Commercial Tax & Proforma invoice workbench featuring multi-tier senior approvals, automated GST calculation, milestone tagging, TDS handling, and Proforma-to-Tax conversion.',
      kpis: [{ label: 'BILLED INVOICES', val: 'Rs. 1,850 L' }, { label: 'PENDING APPROVAL', val: '4 Invoices' }, { label: 'COLLECTION DUE', val: 'Rs. 420 L' }],
      mockupType: 'table',
      talkPoints: [
        'Show Senior Approval Gates: Invoices > Rs. 5 Lakhs require Director approval prior to client dispatch.',
        'Demonstrate Proforma-to-Tax Invoice 1-click conversion when advance payment is received.',
        'Highlight direct action buttons to trigger cleared payments or request AR Write-offs.'
      ]
    },
    {
      category: 'MAIN MENU 2: SALES & REVENUE',
      submenu: '2.4 Orders & Contracts',
      url: 'orders.html',
      description: 'Execution contract tracking for converted client purchase orders, dispatch milestones, and contract SLAs.',
      kpis: [{ label: 'BOOKED ORDERS', val: '32 Orders' }, { label: 'CONTRACT VALUE', val: 'Rs. 1,820 L' }, { label: 'DISPATCHED', val: '84%' }],
      mockupType: 'table',
      talkPoints: [
        'Demonstrate order fulfillment tracking across equipment dispatch and commissioning.',
        'Highlight equipment vs spare parts vs service order category splits.',
        'Show customer purchase order (PO) reference numbers and agreement terms.'
      ]
    },
    {
      category: 'MAIN MENU 2: SALES & REVENUE',
      submenu: '2.5 Payments, AR Aging & Bad Debt Write-Offs',
      url: 'payments.html',
      description: 'Accounts Receivable (AR) management, milestone collections, pending-only invoice filtering, and Director-authorized Goodwill Discounts / Bad Debt Write-Offs.',
      kpis: [{ label: 'COLLECTED CASH', val: 'Rs. 1,420 L' }, { label: 'PENDING AR', val: 'Rs. 400 L' }, { label: 'DSO AVG', val: '34 Days' }],
      mockupType: 'table',
      talkPoints: [
        'Show pending-only client & invoice selectors displaying real-time balance due.',
        'Demonstrate Goodwill Discount and Bad Debt Write-Off requests with mandatory Director authorization.',
        'Highlight automated TDS deduction handling and audit voucher generation.'
      ]
    },
    {
      category: 'MAIN MENU 2: SALES & REVENUE',
      submenu: '2.6 Master Data & Bulk CSV Upload Center',
      url: 'master-data.html',
      description: 'Enterprise catalog & relationship management for Clients, Active Projects, Employee Hierarchy, and Spare Parts with standardized CSV template bulk uploaders.',
      kpis: [{ label: 'ACTIVE CLIENTS', val: '124 Records' }, { label: 'PROJECTS', val: '45 Active' }, { label: 'PARTS CATALOG', val: '350 SKUs' }],
      mockupType: 'table',
      talkPoints: [
        'Download prescribed CSV templates with pre-configured headers and sample rows.',
        'Demonstrate bulk CSV upload with duplicate detection, GSTIN verification, and instant batch import.',
        'Explain transition workflow from demo records to actual live enterprise master data.'
      ]
    },

    // --- CATEGORY 3: SERVICE & QUALITY ---
    {
      category: 'MAIN MENU 3: SERVICE & QUALITY',
      submenu: '3.1 Service Tickets & Quality SLA',
      url: 'service-tickets.html',
      description: 'Post-sale customer support ticket tracking, warranty claims, equipment downtime, and service level agreement (SLA) compliance.',
      kpis: [{ label: 'OPEN TICKETS', val: '12 Active' }, { label: 'SLA COMPLIANCE', val: '96.2%' }, { label: 'AVG RESOLUTION', val: '4.2 Hrs' }],
      mockupType: 'table',
      talkPoints: [
        'Filter tickets by Priority (P1 Critical to P4 Low) and Service Vertical.',
        'Demonstrate engineer assignment and SLA response time tracking.',
        'Explain how post-sale quality protects recurring customer contract renewals.'
      ]
    },

    // --- CATEGORY 4: FINANCE & LEDGER ---
    {
      category: 'MAIN MENU 4: FINANCE & LEDGER',
      submenu: '4.1 Expenses & Profit Center',
      url: 'expenses.html',
      description: 'Project-wise operational expenses, direct material costs, travel reimbursements, and vertical profit margin calculations.',
      kpis: [{ label: 'TOTAL EXPENSES', val: 'Rs. 340 L' }, { label: 'PROJECT OVERHEAD', val: '14.2%' }, { label: 'CLAIM QUEUE', val: '8 Pending' }],
      mockupType: 'table',
      talkPoints: [
        'Show cost allocations across direct material, site travel, and administrative overheads.',
        'Compare vertical gross revenue against vertical operating expenses for net profit %.',
        'Demonstrate expense claim submission and manager approval status.'
      ]
    },
    {
      category: 'MAIN MENU 4: FINANCE & LEDGER',
      submenu: '4.2 Payroll & CTC Administration',
      url: 'payroll.html',
      description: 'Monthly employee compensation processing, statutory deductions (PF, ESI, TDS), and attendance-adjusted net payout logs.',
      kpis: [{ label: 'MONTHLY PAYROLL', val: 'Rs. 48.5 L' }, { label: 'TOTAL STAFF', val: '200 Headcount' }, { label: 'DISBURSED', val: '100%' }],
      mockupType: 'table',
      talkPoints: [
        'Show CTC salary structure breakdown (Basic, HRA, Special Allowance, Incentives).',
        'Highlight automated Loss-of-Pay (LOP) calculation linked directly to Attendance punch logs.',
        'Demonstrate confidential salary ledger view restricted by Role-Based Access Control.'
      ]
    },

    // --- CATEGORY 5: PEOPLE & HR ---
    {
      category: 'MAIN MENU 5: PEOPLE & HR',
      submenu: '5.1 Employee Directory & Org Hierarchy',
      url: 'employees.html',
      description: 'Complete organization headcount master, employee mobile ID records, contact phone numbers, department allocation, and reporting supervisor hierarchy.',
      kpis: [{ label: 'ACTIVE ROSTER', val: '200 Members' }, { label: 'MOBILE IDS', val: '100% Configured' }, { label: 'DEPARTMENTS', val: '6 Divisions' }],
      mockupType: 'table',
      talkPoints: [
        'Filter staff by Department, Name, Email, or 10-digit Mobile Phone Number.',
        'View complete Employee Contact Records including Mobile Phone Number and Mobile ID.',
        'Demonstrate Mobile ID authentication login and Admin password management tools.',
        'Show supervisor reporting lines establishing clear organizational hierarchy.'
      ]
    },
    {
      category: 'MAIN MENU 5: PEOPLE & HR',
      submenu: '5.2 Attendance & Leaves',
      url: 'attendance.html',
      description: 'Daily check-in / punch-out time tracking, shift duration calculation, Work-From-Home (WFH) logs, and leave approval workflows.',
      kpis: [{ label: 'TODAY PRESENT', val: '188 Staff' }, { label: 'ON LEAVE', val: '8 Members' }, { label: 'PUNCTUALITY', val: '95.4%' }],
      mockupType: 'chart',
      talkPoints: [
        'Show daily punch log timestamps and shift working hours.',
        'Demonstrate leave application submission and manager approval queue.',
        'Explain how attendance logs directly feed payroll Loss-Of-Pay deductions.'
      ]
    },
    {
      category: 'MAIN MENU 5: PEOPLE & HR',
      submenu: '5.3 My Team Workspace',
      url: 'my-team.html',
      description: 'Dedicated team lead dashboard displaying direct reportees, active task workloads, attendance status, and pending appraisals.',
      kpis: [{ label: 'DIRECT REPORTS', val: '8 Members' }, { label: 'TASKS COMPLETED', val: '92%' }, { label: 'TEAM RATING', val: '4.6 / 5.0' }],
      mockupType: 'table',
      talkPoints: [
        'Show supervisor-level view of direct team member performance.',
        'Highlight active task allocations and daily task completion status.',
        'Demonstrate manager appraisal rating tools for team members.'
      ]
    },

    // --- CATEGORY 6: PERFORMANCE ---
    {
      category: 'MAIN MENU 6: PERFORMANCE',
      submenu: '6.1 My Scorecard',
      url: 'my-scorecard.html',
      description: 'Personal performance gauge calculating employee target achievement scores based on active KRAs, target metrics, and weightages.',
      kpis: [{ label: 'SCORE OVERALL', val: '88.4%' }, { label: 'KRA WEIGHTED', val: '4.4 / 5.0' }, { label: 'TIER RANK', val: 'Top 10%' }],
      mockupType: 'chart',
      talkPoints: [
        'Show real-time score gauge calculating weighted performance.',
        'Highlight month-over-month score progression and target achievement trend.',
        'Explain how clear scorecards foster transparent accountability across staff.'
      ]
    },
    {
      category: 'MAIN MENU 6: PERFORMANCE',
      submenu: '6.2 Daily Work Management (DWM) & Productivity Engine',
      url: 'dwm.html',
      description: 'Daily task logging system with employee auto-selection from active session, 100% credit for Special Assignments (Full-Day Training/Emergency), and productivity scoring.',
      kpis: [{ label: 'DWM COMPLIANCE', val: '96.2%' }, { label: 'TASKS LOGGED', val: '1,480 Items' }, { label: 'PROD. SCORE', val: '92.4%' }],
      mockupType: 'table',
      talkPoints: [
        'Demonstrate morning task planning and evening accomplishment logs with verified work hours.',
        'Highlight Special Assignment Productivity Engine: Full-Day Training, Customer Emergencies, or Site Audits grant 100% full daily productivity score.',
        'Show real-time score badges and historical 7-day productivity strip.'
      ]
    },
    {
      category: 'MAIN MENU 6: PERFORMANCE',
      submenu: '6.3 KRAs & Target Metrics',
      url: 'kra-targets.html',
      description: 'Key Result Area definitions mapping company strategic goals to functional departments with quarterly metric targets.',
      kpis: [{ label: 'ACTIVE KRAs', val: '24 Targets' }, { label: 'AVG WEIGHT', val: '25% Each' }, { label: 'TARGET MET', val: '86%' }],
      mockupType: 'table',
      talkPoints: [
        'Show KRA target values, unit metrics (INR Lakhs, %, Numbers), and weightage sums (100%).',
        'Highlight quarterly target allocations matching AOP goals.',
        'Demonstrate editing target thresholds with Admin permissions.'
      ]
    },
    {
      category: 'MAIN MENU 6: PERFORMANCE',
      submenu: '6.4 Performance Reviews & Appraisals',
      url: 'reviews.html',
      description: 'Structured 360-degree appraisal workflows, self-assessments, manager evaluations, and annual review ratings.',
      kpis: [{ label: 'REVIEWS COMPLETED', val: '194 / 200' }, { label: 'AVG RATING', val: '4.2 / 5.0' }, { label: 'PROMOTIONS', val: '14 Eligible' }],
      mockupType: 'table',
      talkPoints: [
        'Demonstrate multi-stage appraisal form submission (Self -> Manager -> HR).',
        'Show bell-curve rating distribution and qualitative feedback logs.',
        'Explain how reviews tie directly into annual compensation increments.'
      ]
    },
    {
      category: 'MAIN MENU 6: PERFORMANCE',
      submenu: '6.5 Annual Operating Plan (AOP)',
      url: 'aop-targets.html',
      description: 'Company-wide strategic revenue targets allocated across Equipment Sales, Automation Projects, and Spare Parts verticals per FY.',
      kpis: [{ label: 'AOP GOAL FY26', val: 'Rs. 3,200 L' }, { label: 'ACHIEVED TO DATE', val: 'Rs. 2,450 L' }, { label: 'AOP PACE', val: '76.5%' }],
      mockupType: 'chart',
      talkPoints: [
        'Show macro enterprise targets set by Managing Director for FY 2024-26.',
        'Highlight vertical target splits (Equipment, Service/Parts, Automation).',
        'Demonstrate top-down strategic alignment down to department KRAs.'
      ]
    },

    // --- CATEGORY 7: ANALYTICS & DOCUMENTATION ---
    {
      category: 'MAIN MENU 7: ANALYTICS & DOCUMENTATION',
      submenu: '7.1 Executive Reports & Live SOP Guide',
      url: 'reports.html / user-guide.html',
      description: 'Cross-functional executive analytics, cash flow trends, audit vouchers, and single-click PDF / CSV operating manual compilation.',
      kpis: [{ label: 'REPORTS ACTIVE', val: '9 Modules' }, { label: 'EXPORT FORMATS', val: 'PDF / CSV / Print' }, { label: 'DOC VERSION', val: 'v2.6 SOP' }],
      mockupType: 'chart',
      talkPoints: [
        'Demonstrate cross-departmental report generation with date range filters and PDF exports.',
        'Highlight one-click client demonstration PDF generator and live SOP guide.',
        'Conclude demonstration emphasizing end-to-end operational rigor and governance.'
      ]
    }
  ];

  fullSequentialMenuData.forEach((item) => {
    checkNewPage(65);

    // Main Category Header Tag
    doc.setFillColor(15, 23, 42);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(226, 131, 189);
    doc.text(item.category, margin + 4, y + 4.8);
    y += 9;

    // Submenu Title & URL
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${item.submenu}`, margin, y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(37, 99, 235); // blue-600
    doc.text(`[ URL: ${item.url} ]`, margin + contentWidth - 48, y);
    y += 5.2;

    // Description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const descLines = doc.splitTextToSize(item.description, contentWidth);
    doc.text(descLines, margin, y);
    y += (descLines.length * 3.8) + 2;

    // Draw Visual UI Screen Mockup
    drawUIMockup(margin, y, contentWidth, 38, item.submenu, item.url, item.kpis, item.mockupType);
    y += 42;

    // Key Demonstration Talking Points Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    const tpHeight = (item.talkPoints.length * 4.2) + 7;
    doc.roundedRect(margin, y, contentWidth, tpHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(152, 43, 104);
    doc.text('Key Demonstration Talking Points & Operating Steps:', margin + 4, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    let tpY = y + 8.5;
    item.talkPoints.forEach(tp => {
      doc.text(`* ${tp}`, margin + 6, tpY);
      tpY += 4.2;
    });

    y += tpHeight + 7;
  });

  // --- SECTION 3: PPTX SLIDE DECK OUTLINE FOR PRESENTATIONS ---
  checkNewPage(25);
  doc.setFillColor(30, 58, 138);
  doc.rect(margin, y, 4, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 58, 138);
  doc.text('3. PowerPoint (PPTX) Executive Presentation Deck Outline (8 Slides)', margin + 7, y + 7);
  y += 15;

  const slides = [
    {
      title: 'Slide 1: Executive Title & Strategic Vision',
      header: 'Measure DI RevOps -- Unifying Revenue Operations, Billing & Performance',
      bullets: [
        'Challenge: Disconnected billing spreadsheets, delayed collections, and unaligned daily execution.',
        'Solution: Single source of truth unifying Sales CRM, Invoicing Approvals, AR Adjustments, and HR.',
        'Outcome: Complete Lead-to-Cash visibility and 100% strategic alignment across 200 staff.'
      ]
    },
    {
      title: 'Slide 2: Executive Dashboard (Macro Overview)',
      header: 'Real-Time Operational Cockpit with Dynamic Period Scaling',
      bullets: [
        'Unified KPIs: Total Billed Revenue, Active Deal Pipeline, Monthly Expense Burn, Net Margin %.',
        'Mathematical Ratio Scaling: Benchmark targets recalculate dynamically for WTD, MTD, Q1-Q4, H1-H2.',
        'Zero Manual Consolidation: Eliminates slow weekly reports with real-time operational telemetry.'
      ]
    },
    {
      title: 'Slide 3: Lead-to-Cash & Commercial Governance',
      header: 'Accelerating Deal Conversions & Controlling Commercial Terms',
      bullets: [
        'Leads & Quotes: 5-stage funnel + automated discount threshold approvals (Head & MD).',
        'Senior Invoicing: Multi-tier approval gates on high-value invoices with automated GST & TDS.',
        'Payments & Collections: Pending-only billing views, collection aging, and Director AR write-offs.'
      ]
    },
    {
      title: 'Slide 4: Enterprise Master Data & Bulk Import Center',
      header: 'Seamless Transition from Legacy Systems to Clean Master Catalogs',
      bullets: [
        'Standardized Templates: Pre-configured CSV templates for Clients, Projects, Staff, and Spare Parts.',
        'Automated Validation: Instant duplicate detection, GSTIN format check, and bulk batch processing.',
        'Relational Linking: Uploading invoices automatically connects to client and project repositories.'
      ]
    },
    {
      title: 'Slide 5: Workforce Productivity & Daily Cadence',
      header: 'Connecting Human Capital Effort to Strategic Execution',
      bullets: [
        'Employee Roster & Hierarchy: Complete headcount master with supervisor reporting lines.',
        'Daily Work Management (DWM): Auto-selected employee sessions with morning plan vs evening actuals.',
        'Special Assignment Engine: Full-Day Training, Emergency Calls, and Audits grant 100% daily productivity.'
      ]
    },
    {
      title: 'Slide 6: Strategic Alignment -- AOP, KRAs & Scorecards',
      header: 'Top-Down Goal Cascading & Objective Scorecard Accountability',
      bullets: [
        'Annual Operating Plan (AOP): Strategic revenue targets assigned per FY and business vertical.',
        'KRAs & Target Metrics: Departmental Key Result Areas with quarterly targets and weightages.',
        'My Scorecard: Real-time weighted performance gauges and transparent appraisal tracking.'
      ]
    },
    {
      title: 'Slide 7: Financial Discipline & Profit Protection',
      header: 'Controlling Operating Expense Burn & Safeguarding Margins',
      bullets: [
        'Expense Tracking: Direct material, travel claims, and multi-project ledger cost splits.',
        'Profit Center Analysis: Real-time net margin % calculated per vertical and account.',
        'Payroll CTC Integration: Attendance punch logs feed automated Loss-of-Pay (LOP) salary deductions.'
      ]
    },
    {
      title: 'Slide 8: Enterprise Security, Cloud Resilience & PDF Exports',
      header: 'Scalable, Secure, and Resilient Cloud Architecture',
      bullets: [
        'Role-Based Security: Granular permissions for MD (Super Admin), Dept Heads, and Staff.',
        'Dual Resilience: Dual offline LocalStorage + Firebase Firestore cloud synchronization.',
        'Board-Ready Exports: Single-click executive reports, PDF manuals, and CSV data exports.'
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
    y += 2.5;
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
  console.log('Demo Guide PDF created successfully with full 19-module sequence and screen mockups! File size:', buffer.length);
}

buildDemoGuidePDF();
