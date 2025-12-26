import { BrowserRouter } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { AppRouter } from './AppRouter.tsx'
import { AuthProvider } from './providers/AuthProvider.tsx'
import { CategoryProvider } from './providers/CategoryProvider.tsx'
import { AIParserProvider } from './providers/AIParserProvider.tsx'

import React, { useState, useEffect } from 'react';
import LoadingScreenZen from '@/components/LoadingScreenZen';
import { useFund } from './providers/FundProvider';
import { useMessage } from './providers/MessageProvider';

function App() {
  // Lấy trạng thái loading từ fund/message
  const { isLoadingList: isLoadingFundList } = useFund();
  const { isLoadingList: isLoadingMessageList } = useMessage('');

  // State để đảm bảo loading screen hiển thị tối thiểu 1s
  const [minLoading, setMinLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setMinLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Chỉ đóng loading khi cả minLoading=false và fund/message đã load xong
  const isAppLoading = minLoading || isLoadingFundList || isLoadingMessageList;

  if (isAppLoading) {
    return <LoadingScreenZen isLoading={true} />;
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <AuthProvider>
        <CategoryProvider>
          <AIParserProvider>
            <AppRouter />
          </AIParserProvider>
        </CategoryProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
