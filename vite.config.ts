import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          login: path.resolve(__dirname, 'login.html'),
          dashboard: path.resolve(__dirname, 'dashboard.html'),
          myScorecard: path.resolve(__dirname, 'my-scorecard.html'),
          employees: path.resolve(__dirname, 'employees.html'),
          kraTargets: path.resolve(__dirname, 'kra-targets.html'),
          aopTargets: path.resolve(__dirname, 'aop-targets.html'),
          leads: path.resolve(__dirname, 'leads.html'),
          orders: path.resolve(__dirname, 'orders.html'),
          payments: path.resolve(__dirname, 'payments.html'),
          dwm: path.resolve(__dirname, 'dwm.html'),
          attendance: path.resolve(__dirname, 'attendance.html'),
          myTeam: path.resolve(__dirname, 'my-team.html'),
          reviews: path.resolve(__dirname, 'reviews.html'),
          reports: path.resolve(__dirname, 'reports.html'),
          userGuide: path.resolve(__dirname, 'user-guide.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
