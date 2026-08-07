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
    doc.text('Measure DI Technologies -- RevOps Platform Sequential Client Demonstration Guide', margin, margin - 3);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, margin - 1, pageWidth - margin, margin - 1);
  }

  function addFooter() {
    const pageNum = doc.internal.getNumberOfPages();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${pageNum}`, pageWidth - margin - 12, pageHeight - 8);
    doc.text('CONFIDENTIAL -- Sequential Main Menu & Sub-Menu Demonstration Script', margin, pageHeight - 8);
  }

  // --- COVER & HEADER BANNER ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, y, contentWidth, 42, 'F');

  // Accent Brand Strip
  doc.setFillColor(152, 43, 104); // #982B68
  doc.rect(margin, y, 4, 42, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('Measure DI Technologies', margin + 9, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(56, 189, 248); // sky-400
  doc.text('RevOps Client Demonstration Guide (Sequential Menu Flow)', margin + 9, y + 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text('Complete Main Menu & Sub-Menu Sequence Walkthrough with Visual Mockups', margin + 9, y + 32);

  y += 48;

  // Metadata Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('Document Metadata & Structure Specs:', margin + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('- Main Menu Sequence: Overview -> Sales -> Service -> Finance -> People -> Performance -> Analytics', margin + 5, y + 12);
  doc.text('- Audience: Client Decision Makers, C-Suite, MD, Sales Heads, Operations & HR Leads', margin + 5, y + 17);
  doc.text('- Visual Elements: Includes Sidebar Navigation Hierarchy Map & Page Screen Diagrams for Live Demo', margin + 5, y + 22);

  y += 30;

  // --- SECTION 1: SIDEBAR NAVIGATION MAP & SEQUENCE OVERVIEW ---
  checkNewPage(20);
  doc.setFillColor(30, 58, 138); // blue-900
  doc.rect(margin, y, 4, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 58, 138);
  doc.text('1. Main Navigation Hierarchy & Menu Sequence Map', margin + 7, y + 7);
  y += 15;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text('The sidebar navigation is structured into 7 core functional menu sections and 17 sub-menu modules. Present the platform following this exact sequence for maximum client impact:', margin, y);
  y += 8;

  // DRAW VISUAL SIDEBAR DIAGRAM (Mockup Box simulating the sidebar screenshot)
  const sidebarWidth = contentWidth;
  const sidebarHeight = 105;
  checkNewPage(sidebarHeight + 10);

  doc.setFillColor(15, 23, 42); // slate-950 dark sidebar bg
  doc.roundedRect(margin, y, sidebarWidth, sidebarHeight, 3, 3, 'F');

  // Top Title Bar of Sidebar Diagram
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin, y, sidebarWidth, 10, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('SIDEBAR NAVIGATION MENU MAP (Sequential Order)', margin + 6, y + 6.5);

  let sbY = y + 16;
  const col1X = margin + 6;
  const col2X = margin + 94;

  const navMapCol1 = [
    {
      cat: 'OVERVIEW',
      color: [226, 131, 189], // light magenta
      items: ['1. Executive Dashboard (dashboard.html)']
    },
    {
      cat: 'SALES & REVENUE',
      color: [52, 211, 153], // emerald
      items: [
        '2. Leads & Pipeline (leads.html)',
        '3. Orders & Contracts (orders.html)',
        '4. Payments & Collections (payments.html)'
      ]
    },
    {
      cat: 'SERVICE & QUALITY',
      color: [251, 191, 36], // amber
      items: ['5. Service Tickets & Quality (service-tickets.html)']
    },
    {
      cat: 'FINANCE & LEDGER',
      color: [129, 140, 248], // indigo
      items: [
        '6. Expenses & Profit Center (expenses.html)',
        '7. Payroll & CTC (payroll.html)'
      ]
    }
  ];

  const navMapCol2 = [
    {
      cat: 'PEOPLE & HR',
      color: [56, 189, 248], // sky
      items: [
        '8. Employee Directory (employees.html)',
        '9. Attendance & Leaves (attendance.html)',
        '10. My Team (my-team.html)'
      ]
    },
    {
      cat: 'PERFORMANCE',
      color: [244, 114, 182], // pink
      items: [
        '11. My Scorecard (my-scorecard.html)',
        '12. Daily Work / DWM (dwm.html)',
        '13. KRAs & Target Metrics (kra-targets.html)',
        '14. Performance Reviews (reviews.html)',
        '15. Annual Operating Plan / AOP (aop-targets.html)',
        '16. User Guide & PDF Manual (user-guide.html)'
      ]
    },
    {
      cat: 'ANALYTICS',
      color: [167, 139, 250], // purple
      items: ['17. Executive Reports (reports.html)']
    }
  ];

  function renderNavCol(items, startX) {
    let currentY = sbY;
    items.forEach(sec => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(sec.color[0], sec.color[1], sec.color[2]);
      doc.text(`[ ${sec.cat} ]`, startX, currentY);
      currentY += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(226, 232, 240);
      sec.items.forEach(it => {
        doc.text(`  • ${it}`, startX, currentY);
        currentY += 4.2;
      });
      currentY += 2;
    });
  }

  renderNavCol(navMapCol1, col1X);
  renderNavCol(navMapCol2, col2X);

  y += sidebarHeight + 10;

  // --- FUNCTION TO DRAW MINI UI MOCKUP SCREEN IN PDF ---
  function drawUIMockup(x, curY, width, height, title, subtitle, kpis, layoutType) {
    doc.setFillColor(241, 245, 249); // slate-100 bg
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(x, curY, width, height, 2, 2, 'FD');

    // Header bar of screen mockup
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(x, curY, width, 8, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text(`SCREEN MOCKUP: ${title}`, x + 4, curY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(subtitle, x + width - 45, curY + 5.5);

    // KPI Cards inside Mockup
    if (kpis && kpis.length > 0) {
      const cardW = (width - 10 - (kpis.length - 1) * 3) / kpis.length;
      kpis.forEach((k, idx) => {
        const kX = x + 5 + idx * (cardW + 3);
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(kX, curY + 11, cardW, 11, 1.5, 1.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6);
        doc.setTextColor(100, 116, 139);
        doc.text(k.label, kX + 2, curY + 15);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(15, 23, 42);
        doc.text(k.val, kX + 2, curY + 20);
      });
    }

    // Chart / Table Area Placeholder in Mockup
    const bodyY = curY + 24;
    const bodyH = height - 26;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x + 5, bodyY, width - 10, bodyH, 1.5, 1.5, 'FD');

    if (layoutType === 'chart') {
      // Draw simulated bar chart bars
      doc.setFillColor(59, 130, 246); // blue
      doc.rect(x + 12, bodyY + 6, 8, bodyH - 9, 'F');
      doc.setFillColor(99, 102, 241); // indigo
      doc.rect(x + 24, bodyY + 4, 8, bodyH - 7, 'F');
      doc.setFillColor(16, 185, 129); // emerald
      doc.rect(x + 36, bodyY + 2, 8, bodyH - 5, 'F');
      doc.setFillColor(245, 158, 11); // amber
      doc.rect(x + 48, bodyY + 8, 8, bodyH - 11, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(71, 85, 105);
      doc.text('Performance Trend & Funnel Analytics Visualization', x + 62, bodyY + 8);
      doc.setFont('helvetica', 'normal');
      doc.text('• Period filter recalculates target benchmark ratios in real-time.', x + 62, bodyY + 12);
      doc.text('• Interactive hover drill-downs active across all verticals.', x + 62, bodyY + 15);
    } else {
      // Draw simulated table rows
      doc.setFillColor(241, 245, 249);
      doc.rect(x + 7, bodyY + 2, width - 14, 4, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.setTextColor(30, 41, 59);
      doc.text('Item ID / Customer    Status / Stage    Amount (INR)    Owner', x + 9, bodyY + 5);

      for (let r = 0; r < 3; r++) {
        const rY = bodyY + 7 + r * 3.8;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(5.5);
        doc.setTextColor(100, 116, 139);
        doc.text(`Record #${101 + r} - Active      In Progress        Rs. ${(r + 1) * 2.5} Lakhs   Lead Manager`, x + 9, rY + 3);
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
  doc.text('2. Sequential Main Menu & Sub-Menu Demonstration Script', margin + 7, y + 7);
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
      submenu: '2.2 Orders & Contracts',
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
      submenu: '2.3 Payments & Collections',
      url: 'payments.html',
      description: 'Accounts Receivable (AR) management, milestone invoicing, and payment collection tracking to shorten Days Sales Outstanding (DSO).',
      kpis: [{ label: 'COLLECTED CASH', val: 'Rs. 1,420 L' }, { label: 'PENDING AR', val: 'Rs. 400 L' }, { label: 'DSO AVG', val: '34 Days' }],
      mockupType: 'table',
      talkPoints: [
        'Show advance, dispatch, and final milestone payment status.',
        'Highlight overdue payment alerts and collection aging breakdown.',
        'Demonstrate real-time collection reconciliation against total contract value.'
      ]
    },

    // --- CATEGORY 3: SERVICE & QUALITY ---
    {
      category: 'MAIN MENU 3: SERVICE & QUALITY',
      submenu: '3.1 Service Tickets & Quality',
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
      submenu: '4.2 Payroll & CTC',
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
      submenu: '5.1 Employee Directory',
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
      submenu: '6.2 Daily Work Management (DWM)',
      url: 'dwm.html',
      description: 'Daily task logging system where employees log planned vs actual daily achievements with manager verification ratings.',
      kpis: [{ label: 'DWM COMPLIANCE', val: '94.8%' }, { label: 'TASKS LOGGED', val: '1,420 Items' }, { label: 'VERIFIED', val: '98%' }],
      mockupType: 'table',
      talkPoints: [
        'Show daily morning task planning and evening accomplishment logs.',
        'Highlight manager verification checkmarks and feedback notes.',
        'Explain how DWM ensures daily operational discipline across all 200 staff.'
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
      submenu: '6.4 Performance Reviews',
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
    {
      category: 'MAIN MENU 6: PERFORMANCE',
      submenu: '6.6 User Guide & PDF Manual',
      url: 'user-guide.html',
      description: 'Central documentation portal containing operating manuals, role permission matrix, SOP routines, and 2-Year Data Reload triggers.',
      kpis: [{ label: 'DOC VERSION', val: 'v2.4 SOP' }, { label: 'DATASET HORIZON', val: '2024-2026' }, { label: 'CLOUD SYNC', val: 'Firebase Active' }],
      mockupType: 'table',
      talkPoints: [
        'Show "Client Demo Guide (PDF)" download button.',
        'Demonstrate "Reload 2-Yr Data" trigger to reset demo dataset instantly.',
        'Explain Role-Based Access Control matrix and offline LocalStorage resilience.'
      ]
    },

    // --- CATEGORY 7: ANALYTICS ---
    {
      category: 'MAIN MENU 7: ANALYTICS',
      submenu: '7.1 Executive Reports',
      url: 'reports.html',
      description: 'Consolidated executive analytics, revenue vs expense variance, cash flow trends, and single-click PDF / CSV export tools.',
      kpis: [{ label: 'REPORTS ACTIVE', val: '8 Modules' }, { label: 'EXPORT FORMATS', val: 'PDF / CSV / Print' }, { label: 'AUDIT LOGS', val: '100% Tracked' }],
      mockupType: 'chart',
      talkPoints: [
        'Demonstrate cross-departmental report generation with date range filters.',
        'Export board-ready PDF summaries and raw CSV datasets for spreadsheet modeling.',
        'Conclude demonstration emphasizing complete operational governance.'
      ]
    }
  ];

  fullSequentialMenuData.forEach((item, index) => {
    checkNewPage(65);

    // Main Category Header Tag
    doc.setFillColor(15, 23, 42);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(226, 131, 189);
    doc.text(item.category, margin + 4, y + 5);
    y += 9;

    // Submenu Title & URL
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`${item.submenu}`, margin, y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(37, 99, 235); // blue-600
    doc.text(`[ URL: ${item.url} ]`, margin + contentWidth - 48, y);
    y += 5.5;

    // Description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const descLines = doc.splitTextToSize(item.description, contentWidth);
    doc.text(descLines, margin, y);
    y += (descLines.length * 4) + 2;

    // Draw Visual UI Screen Mockup
    drawUIMockup(margin, y, contentWidth, 42, item.submenu, item.url, item.kpis, item.mockupType);
    y += 46;

    // Key Demonstration Talking Points Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    const tpHeight = (item.talkPoints.length * 4.5) + 8;
    doc.roundedRect(margin, y, contentWidth, tpHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(152, 43, 104);
    doc.text('Key Demonstration Talking Points & Action Steps:', margin + 4, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    let tpY = y + 9.5;
    item.talkPoints.forEach(tp => {
      doc.text(`• ${tp}`, margin + 6, tpY);
      tpY += 4.5;
    });

    y += tpHeight + 8;
  });

  // --- SECTION 3: PPTX SLIDE DECK OUTLINE FOR PRESENTATIONS ---
  checkNewPage(25);
  doc.setFillColor(30, 58, 138);
  doc.rect(margin, y, 4, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 58, 138);
  doc.text('3. PowerPoint (PPTX) Slide Deck Outline (8 Executive Slides)', margin + 7, y + 7);
  y += 15;

  const slides = [
    {
      title: 'Slide 1: Executive Title & Strategic Vision',
      header: 'Measure DI RevOps -- Unifying Revenue Operations & Performance',
      bullets: [
        'Challenge: Fragmented departmental spreadsheets cause collection delays and unaligned targets.',
        'Solution: Single control tower uniting Sales, Finance, HR, and Field Service Operations.',
        'Outcome: Complete Lead-to-Cash visibility and 100% strategic alignment across 200 staff.'
      ]
    },
    {
      title: 'Slide 2: Executive Dashboard (Overview)',
      header: 'Real-Time Operational Cockpit for Leadership',
      bullets: [
        'Unified KPIs: Total Revenue, Active Pipeline, Monthly Expenses, Net Profit Margin.',
        'Period Ratio Scaling: Target benchmarks recalculate dynamically for WTD, MTD, Q1-Q4, H1-H2.',
        'Zero Manual Consolidation: Replaces slow weekly Excel reports with real-time analytics.'
      ]
    },
    {
      title: 'Slide 3: Sales Pipeline & Commercial Velocity',
      header: 'Maximizing Deal Conversion & Cash Receipts',
      bullets: [
        'Leads CRM: 5-stage sales funnel with deal probability weighting.',
        'Orders & Contracts: Commercial fulfillment tracking and dispatch milestones.',
        'Payments: Accounts Receivable (AR) milestone tracking reducing Days Sales Outstanding (DSO).'
      ]
    },
    {
      title: 'Slide 4: Workforce Productivity & Governance',
      header: 'Connecting Human Capital Capacity to Revenue Execution',
      bullets: [
        'Employee Roster: Centralized headcount records and department mapping.',
        'My Team Workspace: Direct manager controls for task workloads and approvals.',
        'Attendance & Payroll: Automated punch logs linked to monthly payroll LOP deductions.'
      ]
    },
    {
      title: 'Slide 5: Strategic Alignment -- AOP, KRAs & Scorecards',
      header: 'Top-Down Goal Cascading & Individual Accountability',
      bullets: [
        'Annual Operating Plan (AOP): Strategic company-wide revenue goals set per FY.',
        'KRAs & Target Metrics: Departmental Key Result Areas with quarterly targets.',
        'My Scorecard: Real-time weighted performance gauges for all employees.'
      ]
    },
    {
      title: 'Slide 6: Financial Discipline & Profit Protection',
      header: 'Controlling Operating Expense Burn & Safeguarding Margins',
      bullets: [
        'Expense Tracking: Direct material, travel claims, and departmental overheads.',
        'Profit Center Analysis: Real-time net margin % calculated per vertical.',
        'Approval Governance: Structured manager approval queues for claim reimbursements.'
      ]
    },
    {
      title: 'Slide 7: Post-Sale Service & Daily Discipline',
      header: 'Protecting Customer Retention & Operating Cadence',
      bullets: [
        'Service Tickets: Client support SLA tracking across P1-P4 priority tiers.',
        'Daily Work Management (DWM): Morning planning and evening task accomplishment logs.',
        'Operational Rigor: Drives daily discipline across all 200 connected staff.'
      ]
    },
    {
      title: 'Slide 8: Enterprise Security, Exports & Architecture',
      header: 'Scalable, Secure, and Resilient Cloud Architecture',
      bullets: [
        'Role-Based Security: Granular permissions for MD, Dept Heads, and Staff.',
        'Data Resilience: Dual offline LocalStorage + Firebase Firestore cloud synchronization.',
        'Executive Analytics: One-click PDF & CSV exports for board presentations.'
      ]
    }
  ];

  slides.forEach(s => {
    checkNewPage(26);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(s.title, margin, y);
    y += 4.5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 58, 138);
    doc.text(`Header: ${s.header}`, margin + 2, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    s.bullets.forEach(b => {
      doc.text(`• ${b}`, margin + 4, y);
      y += 4.2;
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
  console.log('Demo Guide PDF created successfully with full menu sequence and screen mockups! File size:', buffer.length);
}

buildDemoGuidePDF();
