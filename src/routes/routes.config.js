// routes/routes.config.js
export const routes = [
  {
    path: 'home',
    name: 'Home',
    component: 'HomePage',
    showInNav: true,
    icon: 'FaHome'
  },
  {
    path: 'analysis',
    name: 'AI Analysis',
    component: 'AnalysisPage',
    showInNav: true,
    icon: 'FaChartBar'
  },
  {
    path: 'contact',
    name: 'Contact Us',
    component: 'ContactPage',
    showInNav: true,
    icon: 'FaEnvelope'
  },
  {
    path: 'profile',
    name: 'Profile',
    component: 'ProfilePage',
    showInNav: false, // لا يظهر في الNavbar العادي
    icon: 'FaUser',
    hasSubRoutes: true, // إضافة هذا
    subRoutes: {
      personal: {
        path: 'profile',
        name: 'Personal Info',
        component: 'ProfileInfo'
      },
      records: {
        path: 'records',
        name: 'Records',
        component: 'Records'
      },
      settings: {
        path: 'settings',
        name: 'Settings',
        component: 'Settings'
      }
    }
  }
];