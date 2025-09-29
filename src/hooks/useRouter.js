// hooks/useRouter.js - Custom Hook للRouting
import { useState, useEffect } from 'react';
import { defaultRoute } from '../routes/routes.config';

export const useRouter = () => {
  const [currentPage, setCurrentPage] = useState(defaultRoute);
  const [history, setHistory] = useState([defaultRoute]);

  // التنقل لصفحة جديدة
  const navigateTo = (page) => {
    setCurrentPage(page);
    setHistory(prev => [...prev, page]);
  };

  // العودة للصفحة السابقة
  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // إزالة الصفحة الحالية
      const previousPage = newHistory[newHistory.length - 1];
      setCurrentPage(previousPage);
      setHistory(newHistory);
    }
  };

  // إعادة تعيين إلى الصفحة الرئيسية
  const goHome = () => {
    setCurrentPage(defaultRoute);
    setHistory([defaultRoute]);
  };

  return {
    currentPage,
    navigateTo,
    goBack,
    goHome,
    history,
    canGoBack: history.length > 1
  };
};