// auth-guard.js - Measure DI RevOps Auth Guard & Global UI Header Renderer

function checkAuth(allowedRoles) {
  var userRole = localStorage.getItem('userRole');
  var userEmail = localStorage.getItem('userEmail');
  var userName = localStorage.getItem('userName') || 'User';
  var employeeId = localStorage.getItem('employeeId');

  // Auto-migrate legacy Arun Sharma / E-000 sessions to Ravichandran (E-001, Managing Director)
  if (employeeId === 'E-000' || (userName && userName.indexOf('Arun') !== -1)) {
    employeeId = 'E-001';
    userName = 'Ravichandran';
    userEmail = 'ars.okd@gmail.com';
    userRole = 'admin';
    localStorage.setItem('employeeId', 'E-001');
    localStorage.setItem('userName', 'Ravichandran');
    localStorage.setItem('userEmail', 'ars.okd@gmail.com');
    localStorage.setItem('userRole', 'admin');
  }

  if (!userRole || !employeeId) {
    window.location.href = 'login.html';
    return false;
  }

  // Check if account isActive
  var employees = window.RevOpsStore.getCollection('employees');
  var currentEmp = employees.find(function(e) {
    return e.employeeId === employeeId || e.email === userEmail;
  });

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
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    alert("Unauthorized access. Redirecting to your default workspace.");
    if (userRole === 'staff') {
      window.location.href = 'my-scorecard.html';
    } else {
      window.location.href = 'dashboard.html';
    }
    return false;
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

  var showTeamAndReviews = (userRole === 'admin' || userRole === 'manager' || hasDirectReports);
  var isAdmin = (userRole === 'admin');

  var currentPath = window.location.pathname.split('/').pop() || 'index.html';

  function linkClass(path) {
    var active = currentPath === path;
    return active 
      ? "px-3 py-2 text-xs font-semibold text-white bg-slate-800 rounded-lg border-b-2 border-[#982B68] shadow-xs"
      : "px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors";
  }

  var roleBadgeColor = "bg-[#982B68]/30 text-[#E283BD] border-[#982B68]/50";
  if (userRole === 'admin') roleBadgeColor = "bg-purple-900/60 text-purple-300 border-purple-700/50";
  if (userRole === 'manager') roleBadgeColor = "bg-blue-900/60 text-blue-300 border-blue-700/50";
  if (userRole === 'staff') roleBadgeColor = "bg-emerald-900/60 text-emerald-300 border-emerald-700/50";

  var html = `
    <nav class="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 text-slate-300 shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          
          <!-- Left Brand -->
          <div class="flex items-center space-x-3">
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

          <!-- Center Nav Links -->
          <div class="hidden xl:flex items-center space-x-1">
            ${userRole !== 'staff' ? `<a href="dashboard.html" class="${linkClass('dashboard.html')}">Dashboard</a>` : ''}
            <a href="my-scorecard.html" class="${linkClass('my-scorecard.html')}">My Scorecard</a>
            <a href="dwm.html" class="${linkClass('dwm.html')}">DWM</a>
            <a href="attendance.html" class="${linkClass('attendance.html')}">Attendance</a>
            ${showTeamAndReviews ? `<a href="my-team.html" class="${linkClass('my-team.html')}">My Team</a>` : ''}
            ${showTeamAndReviews ? `<a href="reviews.html" class="${linkClass('reviews.html')}">Reviews</a>` : ''}
            ${isAdmin ? `<a href="employees.html" class="${linkClass('employees.html')}">Employees</a>` : ''}
            <a href="kra-targets.html" class="${linkClass('kra-targets.html')}">KRAs</a>
            ${isAdmin ? `<a href="aop-targets.html" class="${linkClass('aop-targets.html')}">AOP</a>` : ''}
            <a href="leads.html" class="${linkClass('leads.html')}">Leads</a>
            <a href="orders.html" class="${linkClass('orders.html')}">Orders</a>
            <a href="payments.html" class="${linkClass('payments.html')}">Payments</a>
            ${userRole !== 'staff' ? `<a href="reports.html" class="${linkClass('reports.html')}">Reports</a>` : ''}
          </div>

          <!-- Right User Profile & Logout -->
          <div class="flex items-center space-x-3">
            <div class="flex items-center space-x-2.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
              <div class="w-7 h-7 rounded-lg bg-[#982B68]/30 text-[#E283BD] font-bold flex items-center justify-center text-xs border border-[#982B68]/40">
                ${userName.charAt(0)}
              </div>
              <div class="text-left">
                <span class="text-xs font-semibold text-white block leading-tight">Hi, ${userName}</span>
                <span class="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded border ${roleBadgeColor} inline-block leading-none mt-0.5">${userRole}</span>
              </div>
            </div>
            
            <button onclick="if(confirm('Reload full 2-year (2024-2026) dummy dataset into LocalStorage?')) { window.RevOpsStore.reseedAllData(); }" class="px-2.5 py-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/60 rounded-lg transition-colors cursor-pointer flex items-center space-x-1 mr-1" title="Reload 2024-2026 Dummy Data">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              <span>Reload 2-Yr Data</span>
            </button>
            <button onclick="handleRevOpsLogout()" class="px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 rounded-lg transition-colors cursor-pointer flex items-center space-x-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              <span>Logout</span>
            </button>
          </div>

        </div>

        <!-- Mobile / Tablet Nav Scroll Bar -->
        <div class="xl:hidden flex overflow-x-auto space-x-2 pb-2.5 pt-1 text-xs border-t border-slate-800 scrollbar-none">
          ${userRole !== 'staff' ? `<a href="dashboard.html" class="whitespace-nowrap ${linkClass('dashboard.html')}">Dashboard</a>` : ''}
          <a href="my-scorecard.html" class="whitespace-nowrap ${linkClass('my-scorecard.html')}">Scorecard</a>
          <a href="dwm.html" class="whitespace-nowrap ${linkClass('dwm.html')}">DWM</a>
          <a href="attendance.html" class="whitespace-nowrap ${linkClass('attendance.html')}">Attendance</a>
          ${showTeamAndReviews ? `<a href="my-team.html" class="whitespace-nowrap ${linkClass('my-team.html')}">My Team</a>` : ''}
          ${showTeamAndReviews ? `<a href="reviews.html" class="whitespace-nowrap ${linkClass('reviews.html')}">Reviews</a>` : ''}
          ${isAdmin ? `<a href="employees.html" class="whitespace-nowrap ${linkClass('employees.html')}">Employees</a>` : ''}
          <a href="kra-targets.html" class="whitespace-nowrap ${linkClass('kra-targets.html')}">KRAs</a>
          ${isAdmin ? `<a href="aop-targets.html" class="whitespace-nowrap ${linkClass('aop-targets.html')}">AOP</a>` : ''}
          <a href="leads.html" class="whitespace-nowrap ${linkClass('leads.html')}">Leads</a>
          <a href="orders.html" class="whitespace-nowrap ${linkClass('orders.html')}">Orders</a>
          <a href="payments.html" class="whitespace-nowrap ${linkClass('payments.html')}">Payments</a>
          ${userRole !== 'staff' ? `<a href="reports.html" class="whitespace-nowrap ${linkClass('reports.html')}">Reports</a>` : ''}
        </div>

      </div>
    </nav>
  `;

  navContainer.innerHTML = html;

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
