// auth-guard.js - Measure DI RevOps Auth Guard & Global UI Header Renderer

function checkAuth(allowedRoles) {
  var userRole = localStorage.getItem('userRole');
  var userEmail = localStorage.getItem('userEmail');
  var userName = localStorage.getItem('userName') || 'User';
  var employeeId = localStorage.getItem('employeeId');

  // Auto-migrate legacy Arun Sharma / E-000 or older Ravichandran admin session to super_admin
  if (employeeId === 'E-000' || (userName && userName.indexOf('Arun') !== -1)) {
    employeeId = 'E-001';
    userName = 'Ravichandran';
    userEmail = 'ars.okd@gmail.com';
    userRole = 'super_admin';
    localStorage.setItem('employeeId', 'E-001');
    localStorage.setItem('userName', 'Ravichandran');
    localStorage.setItem('userEmail', 'ars.okd@gmail.com');
    localStorage.setItem('userRole', 'super_admin');
  }

  // Ensure E-001 (Ravichandran) is super_admin and E-002 (Murugan) is admin
  if (employeeId === 'E-001' && userRole !== 'super_admin') {
    userRole = 'super_admin';
    localStorage.setItem('userRole', 'super_admin');
  } else if (employeeId === 'E-002' && userRole !== 'admin') {
    userRole = 'admin';
    localStorage.setItem('userRole', 'admin');
  }

  if (!userRole || !employeeId) {
    window.location.href = 'login.html';
    return false;
  }

  // Check if account isActive
  var employees = window.RevOpsStore.getCollection('employees') || [];
  var currentEmp = employees.find(function(e) {
    return e.employeeId === employeeId || e.email === userEmail;
  });

  if (currentEmp) {
    var empUpdated = false;
    if (currentEmp.employeeId === 'E-001' && currentEmp.role !== 'super_admin') {
      currentEmp.role = 'super_admin';
      empUpdated = true;
    } else if (currentEmp.employeeId === 'E-002' && currentEmp.role !== 'admin') {
      currentEmp.role = 'admin';
      empUpdated = true;
    }
    if (empUpdated) {
      window.RevOpsStore.saveCollection('employees', employees);
    }
  }

  if (currentEmp && currentEmp.isActive === false) {
    if (typeof auth !== 'undefined' && auth.signOut) {
      auth.signOut();
    }
    localStorage.clear();
    alert("Your account has been disabled. Contact your manager or admin.");
    window.location.href = 'login.html';
    return false;
  }

  // Check role authorization
  if (allowedRoles && allowedRoles.length > 0) {
    var hasAccess = allowedRoles.includes(userRole) || 
      (allowedRoles.includes('admin') && (userRole === 'super_admin' || userRole === 'admin'));
    if (!hasAccess) {
      alert("Unauthorized access. Redirecting to your default workspace.");
      if (userRole === 'staff') {
        window.location.href = 'my-scorecard.html';
      } else {
        window.location.href = 'dashboard.html';
      }
      return false;
    }
  }

  // Check if user has direct reports
  var hasDirectReports = employees.some(function(e) {
    return e.reportsTo === employeeId;
  });

  // Render standard Navbar
  renderRevOpsNavbar(userName, userRole, hasDirectReports);
  return true;
}

function renderRevOpsNavbar(userName, userRole, hasDirectReports) {
  var navContainer = document.getElementById('navbar-container');
  if (!navContainer) return;

  var userEmail = localStorage.getItem('userEmail') || '';
  var showTeamAndReviews = (userRole === 'super_admin' || userRole === 'admin' || userRole === 'manager' || hasDirectReports);
  var isAdmin = (userRole === 'super_admin' || userRole === 'admin');

  var currentPath = window.location.pathname.split('/').pop() || 'index.html';

  function linkClass(path) {
    var active = currentPath === path;
    return active 
      ? "px-3 py-2 text-xs font-bold text-white bg-slate-800 rounded-lg border-b-2 border-[#982B68] shadow-xs flex items-center space-x-1.5"
      : "px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center space-x-1.5";
  }

  function isCatActive(paths) {
    return paths.indexOf(currentPath) !== -1;
  }

  function renderCategoryMenu(catTitle, iconSvg, items, paths) {
    var catActive = isCatActive(paths);
    var visibleItems = items.filter(function(it) { return it.show; });
    if (visibleItems.length === 0) return '';

    var buttonStyle = catActive
      ? "px-3 py-2 text-xs font-extrabold text-white bg-slate-800 rounded-lg border-b-2 border-[#982B68] shadow-xs flex items-center space-x-1.5 cursor-pointer"
      : "px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer";

    var badge = catActive 
      ? `<span class="w-1.5 h-1.5 rounded-full bg-[#E283BD]"></span>` 
      : '';

    var itemsHtml = visibleItems.map(function(item) {
      var itemActive = currentPath === item.path;
      var activeClass = itemActive
        ? "bg-indigo-950/70 text-indigo-200 border-l-2 border-[#982B68] font-bold"
        : "text-slate-300 hover:bg-slate-800 hover:text-white";

      return `
        <a href="${item.path}" class="flex items-start space-x-2.5 p-2 rounded-lg transition-colors ${activeClass}">
          <span class="text-sm shrink-0 mt-0.5">${item.icon}</span>
          <div class="text-left leading-tight">
            <div class="text-xs font-bold text-white flex items-center justify-between">
              <span>${item.title}</span>
              ${itemActive ? '<span class="text-[9px] uppercase px-1.5 py-0.2 bg-[#982B68] text-white font-extrabold rounded">Active</span>' : ''}
            </div>
            <div class="text-[10px] text-slate-400 font-normal mt-0.5 line-clamp-1">${item.desc}</div>
          </div>
        </a>
      `;
    }).join('');

    return `
      <div class="relative group">
        <button class="${buttonStyle}" onclick="var menu=this.nextElementSibling; menu.classList.toggle('hidden');">
          ${iconSvg}
          <span>${catTitle}</span>
          ${badge}
          <svg class="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>

        <div class="absolute left-0 mt-1 w-64 bg-slate-900 border border-slate-700/90 rounded-xl shadow-2xl p-2 hidden group-hover:block transition-all z-50">
          <div class="text-[10px] font-black uppercase text-slate-400 tracking-wider px-2.5 py-1 border-b border-slate-800 mb-1 flex items-center justify-between">
            <span>${catTitle} Module</span>
            <span class="text-[9px] font-semibold text-slate-500">${visibleItems.length} views</span>
          </div>
          <div class="space-y-1">
            ${itemsHtml}
          </div>
        </div>
      </div>
    `;
  }

  // Categories definitions
  var salesPaths = ['leads.html', 'orders.html', 'payments.html'];
  var salesItems = [
    { title: "Leads & Pipeline", path: "leads.html", desc: "CRM pipeline, stage conversions & deals", icon: "📈", show: true },
    { title: "Orders & Contracts", path: "orders.html", desc: "Customer orders, SLA & fulfillment", icon: "📦", show: true },
    { title: "Payments & Collections", path: "payments.html", desc: "AR collections & milestone invoicing", icon: "💳", show: true }
  ];
  var salesIcon = `<svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>`;

  var financePaths = ['expenses.html', 'payroll.html'];
  var financeItems = [
    { title: "Expenses & Profit Center", path: "expenses.html", desc: "Multi-project split & financial ledger", icon: "💰", show: true },
    { title: "Payroll & CTC", path: "payroll.html", desc: "Monthly salary & disbursement logs", icon: "💵", show: true }
  ];
  var financeIcon = `<svg class="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;

  var hrPaths = ['employees.html', 'attendance.html', 'my-team.html'];
  var hrItems = [
    { title: "Employee Directory", path: "employees.html", desc: "Roster, roles & departments", icon: "👥", show: true },
    { title: "Attendance & Leaves", path: "attendance.html", desc: "Punch logs & leave approvals", icon: "⏰", show: true },
    { title: "My Team", path: "my-team.html", desc: "Direct reportees & org chart", icon: "🏢", show: showTeamAndReviews }
  ];
  var hrIcon = `<svg class="w-3.5 h-3.5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`;

  var perfPaths = ['my-scorecard.html', 'dwm.html', 'kra-targets.html', 'reviews.html', 'aop-targets.html', 'user-guide.html'];
  var perfItems = [
    { title: "My Scorecard", path: "my-scorecard.html", desc: "Personal scorecard & achievement rating", icon: "🎯", show: true },
    { title: "Daily Work (DWM)", path: "dwm.html", desc: "Daily task logs & plan vs actuals", icon: "📅", show: true },
    { title: "KRAs & Target Metrics", path: "kra-targets.html", desc: "Key result areas & quarterly goals", icon: "📊", show: true },
    { title: "Performance Reviews", path: "reviews.html", desc: "360 appraisal feedback & ratings", icon: "📝", show: showTeamAndReviews },
    { title: "Annual Operating Plan (AOP)", path: "aop-targets.html", desc: "Company revenue targets & strategy", icon: "🏆", show: isAdmin },
    { title: "User Guide & PDF Manual", path: "user-guide.html", desc: "Comprehensive RevOps SOP & live PDF manual", icon: "📖", show: true }
  ];
  var perfIcon = `<svg class="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>`;

  var roleBadgeColor = "bg-[#982B68]/30 text-[#E283BD] border-[#982B68]/50";
  if (userRole === 'super_admin') roleBadgeColor = "bg-fuchsia-900/60 text-fuchsia-300 border-fuchsia-700/50";
  else if (userRole === 'admin') roleBadgeColor = "bg-purple-900/60 text-purple-300 border-purple-700/50";
  else if (userRole === 'manager') roleBadgeColor = "bg-blue-900/60 text-blue-300 border-blue-700/50";
  else if (userRole === 'staff') roleBadgeColor = "bg-emerald-900/60 text-emerald-300 border-emerald-700/50";

  var html = `
    <nav class="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 text-slate-300 shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          
          <!-- Left Brand -->
          <div class="flex items-center space-x-3 shrink-0">
            <a href="${userRole === 'staff' ? 'my-scorecard.html' : 'dashboard.html'}" class="flex items-center space-x-2.5 group">
              <!-- Official Measure DI Logo SVG -->
              <div class="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 p-1 group-hover:border-[#982B68] transition-colors">
                <svg class="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M45 22C30 22 18 34 18 49C18 64 30 76 45 76C60 76 72 64 72 49V40H56V49C56 55 51 60 45 60C39 60 34 55 34 49C34 43 39 38 45 38H56V22H45Z" fill="#982B68"/>
                  <rect x="58" y="12" width="7" height="7" fill="#982B68"/>
                  <rect x="67" y="12" width="7" height="7" fill="#982B68"/>
                  <rect x="58" y="21" width="7" height="7" fill="#982B68"/>
                  <rect x="67" y="21" width="7" height="7" fill="#982B68"/>
                  <rect x="67" y="30" width="7" height="7" fill="#982B68"/>
                  <rect x="58" y="30" width="7" height="7" fill="#ffffff"/>
                </svg>
              </div>
              <div>
                <span class="text-base font-extrabold text-white tracking-wider block leading-none">MEASURE DI</span>
                <span class="text-[9px] font-bold text-[#E283BD] tracking-widest uppercase block leading-tight mt-0.5">MADE TO MEASURE</span>
              </div>
            </a>
          </div>

          <!-- Center Categorized Nav Dropdowns (Desktop) -->
          <div class="hidden lg:flex items-center space-x-1.5">
            ${userRole !== 'staff' ? `
              <a href="dashboard.html" class="${linkClass('dashboard.html')}">
                <svg class="w-3.5 h-3.5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                <span>Dashboard</span>
              </a>
            ` : ''}

            ${renderCategoryMenu("Sales & Revenue", salesIcon, salesItems, salesPaths)}
            ${renderCategoryMenu("Finance & Accounting", financeIcon, financeItems, financePaths)}
            ${renderCategoryMenu("People & HR", hrIcon, hrItems, hrPaths)}
            ${renderCategoryMenu("Performance & Strategy", perfIcon, perfItems, perfPaths)}

            ${userRole !== 'staff' ? `
              <a href="reports.html" class="${linkClass('reports.html')}">
                <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                <span>Reports</span>
              </a>
            ` : ''}
          </div>

          <!-- Right User Profile & Mobile Drawer Toggle -->
          <div class="flex items-center space-x-2.5 shrink-0">
            <div class="flex items-center space-x-2 bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-700">
              <div class="w-7 h-7 rounded-lg bg-[#982B68]/30 text-[#E283BD] font-bold flex items-center justify-center text-xs border border-[#982B68]/40">
                ${userName.charAt(0)}
              </div>
              <div class="text-left hidden sm:block">
                <span class="text-xs font-semibold text-white block leading-tight">Hi, ${userName}</span>
                <span class="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded border ${roleBadgeColor} inline-block leading-none mt-0.5">${userRole}</span>
              </div>
            </div>
            
            <a href="user-guide.html" class="px-2.5 py-1.5 text-xs font-bold text-white hover:text-white bg-[#982B68] hover:bg-[#7e2356] border border-[#be3b85] rounded-lg transition-all shadow-xs flex items-center space-x-1" title="Official User Guide & PDF Manual">
              <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
              <span>User Guide</span>
            </a>

            <button onclick="if(confirm('Reload full 2-year (2024-2026) dummy dataset into LocalStorage?')) { window.RevOpsStore.reseedAllData(); }" class="px-2.5 py-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/60 rounded-lg transition-colors cursor-pointer hidden md:flex items-center space-x-1" title="Reload 2024-2026 Dummy Data">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              <span>Reload</span>
            </button>

            <button onclick="handleRevOpsLogout()" class="px-2.5 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 rounded-lg transition-colors cursor-pointer hidden sm:flex items-center space-x-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              <span>Logout</span>
            </button>

            <!-- Mobile Hamburger Toggle -->
            <button onclick="toggleMobileNavDrawer()" class="lg:hidden p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 cursor-pointer flex items-center justify-center space-x-1.5">
              <svg class="w-5 h-5 text-[#E283BD]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
              <span class="text-xs font-bold text-white pr-0.5">Menu</span>
            </button>
          </div>

        </div>

        <!-- Mobile / Tablet Quick Category Pills Strip -->
        <div class="lg:hidden flex overflow-x-auto space-x-2 pb-2.5 pt-1 text-xs border-t border-slate-800 scrollbar-none">
          ${userRole !== 'staff' ? `<a href="dashboard.html" class="whitespace-nowrap ${linkClass('dashboard.html')}">Dashboard</a>` : ''}
          <a href="dwm.html" class="whitespace-nowrap ${linkClass('dwm.html')}">📅 DWM Task Log</a>
          <a href="expenses.html" class="whitespace-nowrap ${linkClass('expenses.html')}">💰 Expenses & Profit</a>
          <a href="leads.html" class="whitespace-nowrap ${linkClass('leads.html')}">📈 Leads CRM</a>
          <a href="attendance.html" class="whitespace-nowrap ${linkClass('attendance.html')}">⏰ Attendance</a>
          <a href="my-scorecard.html" class="whitespace-nowrap ${linkClass('my-scorecard.html')}">🎯 Scorecard</a>
        </div>

      </div>
    </nav>

    <!-- MOBILE CATEGORIZED DRAWER OVERLAY -->
    <div id="mobile-nav-drawer" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md hidden transition-opacity flex justify-end">
      <div class="w-full max-w-xs bg-slate-900 h-full overflow-y-auto p-5 shadow-2xl border-l border-slate-800 flex flex-col justify-between">
        <div>
          <!-- Mobile Drawer Header -->
          <div class="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div class="flex items-center space-x-2.5">
              <div class="w-8 h-8 rounded-lg bg-[#982B68] text-white font-black flex items-center justify-center text-sm shadow-xs">
                M
              </div>
              <div>
                <span class="text-xs font-black text-white uppercase tracking-wider block">Measure DI</span>
                <span class="text-[9px] font-bold text-[#E283BD]">App Navigation</span>
              </div>
            </div>
            <button onclick="toggleMobileNavDrawer()" class="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg text-lg font-bold">&times;</button>
          </div>

          <!-- User Info Banner in Drawer -->
          <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 mb-5 flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-white block">Hi, ${userName}</span>
              <span class="text-[10px] text-slate-400">${userEmail}</span>
            </div>
            <span class="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${roleBadgeColor}">${userRole}</span>
          </div>

          <!-- Categorized Mobile Navigation Accordion List -->
          <div class="space-y-4">
            ${userRole !== 'staff' ? `
              <div>
                <a href="dashboard.html" onclick="toggleMobileNavDrawer()" class="flex items-center space-x-2.5 p-2.5 rounded-xl ${currentPath === 'dashboard.html' ? 'bg-[#982B68] text-white font-bold' : 'bg-slate-800/60 text-slate-200'}">
                  <svg class="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                  <span class="text-xs font-bold">Executive Dashboard</span>
                </a>
              </div>
            ` : ''}

            <!-- Sales Group -->
            <div class="bg-slate-800/40 rounded-xl p-2.5 border border-slate-800">
              <div class="text-[10px] font-black uppercase text-emerald-400 tracking-wider mb-2 flex items-center space-x-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                <span>Sales & Revenue</span>
              </div>
              <div class="space-y-1">
                ${salesItems.filter(function(i){ return i.show; }).map(function(i){
                  return `<a href="${i.path}" onclick="toggleMobileNavDrawer()" class="flex items-center space-x-2 p-2 rounded-lg text-xs font-semibold ${currentPath === i.path ? 'bg-indigo-900 text-white font-extrabold border-l-2 border-[#982B68]' : 'text-slate-300 hover:bg-slate-800'}"><span>${i.icon}</span><span>${i.title}</span></a>`;
                }).join('')}
              </div>
            </div>

            <!-- Finance Group -->
            <div class="bg-slate-800/40 rounded-xl p-2.5 border border-slate-800">
              <div class="text-[10px] font-black uppercase text-indigo-400 tracking-wider mb-2 flex items-center space-x-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>Finance & Accounting</span>
              </div>
              <div class="space-y-1">
                ${financeItems.filter(function(i){ return i.show; }).map(function(i){
                  return `<a href="${i.path}" onclick="toggleMobileNavDrawer()" class="flex items-center space-x-2 p-2 rounded-lg text-xs font-semibold ${currentPath === i.path ? 'bg-indigo-900 text-white font-extrabold border-l-2 border-[#982B68]' : 'text-slate-300 hover:bg-slate-800'}"><span>${i.icon}</span><span>${i.title}</span></a>`;
                }).join('')}
              </div>
            </div>

            <!-- HR Group -->
            <div class="bg-slate-800/40 rounded-xl p-2.5 border border-slate-800">
              <div class="text-[10px] font-black uppercase text-sky-400 tracking-wider mb-2 flex items-center space-x-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                <span>People & HR</span>
              </div>
              <div class="space-y-1">
                ${hrItems.filter(function(i){ return i.show; }).map(function(i){
                  return `<a href="${i.path}" onclick="toggleMobileNavDrawer()" class="flex items-center space-x-2 p-2 rounded-lg text-xs font-semibold ${currentPath === i.path ? 'bg-indigo-900 text-white font-extrabold border-l-2 border-[#982B68]' : 'text-slate-300 hover:bg-slate-800'}"><span>${i.icon}</span><span>${i.title}</span></a>`;
                }).join('')}
              </div>
            </div>

            <!-- Performance Group -->
            <div class="bg-slate-800/40 rounded-xl p-2.5 border border-slate-800">
              <div class="text-[10px] font-black uppercase text-purple-400 tracking-wider mb-2 flex items-center space-x-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
                <span>Performance & Strategy</span>
              </div>
              <div class="space-y-1">
                ${perfItems.filter(function(i){ return i.show; }).map(function(i){
                  return `<a href="${i.path}" onclick="toggleMobileNavDrawer()" class="flex items-center space-x-2 p-2 rounded-lg text-xs font-semibold ${currentPath === i.path ? 'bg-indigo-900 text-white font-extrabold border-l-2 border-[#982B68]' : 'text-slate-300 hover:bg-slate-800'}"><span>${i.icon}</span><span>${i.title}</span></a>`;
                }).join('')}
              </div>
            </div>

            ${userRole !== 'staff' ? `
              <div>
                <a href="reports.html" onclick="toggleMobileNavDrawer()" class="flex items-center space-x-2.5 p-2.5 rounded-xl ${currentPath === 'reports.html' ? 'bg-[#982B68] text-white font-bold' : 'bg-slate-800/60 text-slate-200'}">
                  <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  <span class="text-xs font-bold">Analytics & Reports</span>
                </a>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Mobile Drawer Footer Actions -->
        <div class="pt-6 border-t border-slate-800 space-y-2 mt-6">
          <button onclick="if(confirm('Reload full 2-year dummy dataset?')) { window.RevOpsStore.reseedAllData(); }" class="w-full py-2.5 px-3 bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/80 rounded-xl text-xs font-bold flex items-center justify-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            <span>Reload 2-Yr Data</span>
          </button>
          
          <button onclick="handleRevOpsLogout()" class="w-full py-2.5 px-3 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/80 rounded-xl text-xs font-bold flex items-center justify-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>

    <!-- FIXED MOBILE BOTTOM DOCK FOR QUICK SINGLE-THUMB ACCESS -->
    <div class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-slate-400 py-1.5 px-2 flex items-center justify-around text-[10px]">
      <a href="${userRole === 'staff' ? 'my-scorecard.html' : 'dashboard.html'}" class="flex flex-col items-center py-1 px-2 rounded-lg ${currentPath === 'dashboard.html' || currentPath === 'my-scorecard.html' ? 'text-[#E283BD] font-black' : 'hover:text-white'}">
        <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        <span>Home</span>
      </a>

      <a href="dwm.html" class="flex flex-col items-center py-1 px-2 rounded-lg ${currentPath === 'dwm.html' ? 'text-[#E283BD] font-black' : 'hover:text-white'}">
        <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
        <span>DWM Tasks</span>
      </a>

      <a href="expenses.html" class="flex flex-col items-center py-1 px-2 rounded-lg ${currentPath === 'expenses.html' ? 'text-[#E283BD] font-black' : 'hover:text-white'}">
        <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span>Expenses</span>
      </a>

      <a href="attendance.html" class="flex flex-col items-center py-1 px-2 rounded-lg ${currentPath === 'attendance.html' ? 'text-[#E283BD] font-black' : 'hover:text-white'}">
        <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span>Attendance</span>
      </a>

      <button onclick="toggleMobileNavDrawer()" class="flex flex-col items-center py-1 px-2 rounded-lg text-slate-300 hover:text-white cursor-pointer">
        <svg class="w-5 h-5 mb-0.5 text-[#E283BD]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        <span class="font-bold">All Menu</span>
      </button>
    </div>
  `;

  navContainer.innerHTML = html;
  document.body.classList.add('pb-16', 'lg:pb-0');

  // Append Global Maintenance Footer
  var footerId = 'analytics-spire-footer';
  if (!document.getElementById(footerId)) {
    var footer = document.createElement('footer');
    footer.id = footerId;
    footer.className = "w-full py-4 bg-slate-900 border-t border-slate-800 text-center text-xs text-slate-400 mt-12";
    footer.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div class="flex items-center space-x-2">
          <span class="font-bold text-slate-200">Measure DI Technologies Private Limited</span>
          <span class="text-slate-600">•</span>
          <span class="text-slate-400">Made to Measure RevOps</span>
        </div>
        <div class="text-slate-400 font-medium">
          Developed and maintained by <span class="font-bold text-[#E283BD]">Analytics Spire</span>
        </div>
      </div>
    `;
    document.body.appendChild(footer);
  }
}

function handleRevOpsLogout() {
  if (confirm("Are you sure you want to log out of Measure DI RevOps?")) {
    if (typeof auth !== 'undefined' && auth && auth.signOut) {
      auth.signOut();
    }
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('employeeId');
    window.location.href = 'login.html';
  }
}

function toggleMobileNavDrawer() {
  var drawer = document.getElementById('mobile-nav-drawer');
  if (drawer) {
    drawer.classList.toggle('hidden');
    if (!drawer.classList.contains('hidden')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}

