// utils/navigation.js - دوال مساعدة للNavigation
export const navigationUtils = {
    // التحقق من صحة الRoute
    isValidRoute: (route, availableRoutes) => {
      return availableRoutes.some(r => r.path === route);
    },
  
    // الحصول على معلومات الRoute
    getRouteInfo: (routePath, availableRoutes) => {
      return availableRoutes.find(r => r.path === routePath);
    },
  
    // تحديد الصفحة الافتراضية
    getDefaultRoute: (availableRoutes) => {
      return availableRoutes[0]?.path || 'home';
    },
  
    // إنشاء breadcrumb
    createBreadcrumb: (currentRoute, history, availableRoutes) => {
      return history.map(routePath => {
        const route = availableRoutes.find(r => r.path === routePath);
        return {
          path: routePath,
          name: route?.name || routePath,
          current: routePath === currentRoute
        };
      });
    }
  };