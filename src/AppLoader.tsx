// AppLoader: Hiển thị loading screen ngay lập tức, sau đó mount App thực sự
import React, { useState, useEffect, Suspense } from 'react';
import LoadingScreenZen from '@/components/LoadingScreenZen';

const App = React.lazy(() => import('./App'));

export default function AppLoader() {
  // Hiển thị loading screen ngay khi vào app
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    // Chỉ show app sau khi loading đã hiển thị tối thiểu 1s
    const timer = setTimeout(() => setShowApp(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!showApp) {
    return <LoadingScreenZen isLoading={true} />;
  }

  // Suspense đảm bảo loading screen vẫn hiển thị nếu App chưa load xong
  return (
    <Suspense fallback={<LoadingScreenZen isLoading={true} />}> 
      <App />
    </Suspense>
  );
}
