// AppLoader: Hiển thị loading screen cho đến khi app thực sự ready
import React, { useState, useEffect, Suspense } from 'react'
import LoadingScreenZen from '@/components/LoadingScreenZen'
import { AppReadyProvider, useAppReady } from '@/contexts/AppReadyContext'

const App = React.lazy(() => import('./App'))

// Component nội bộ để lắng nghe ready state
function AppLoaderInner() {
  const { isAppReady } = useAppReady()
  const [minTimeElapsed, setMinTimeElapsed] = useState(false)
  const [maxTimeElapsed, setMaxTimeElapsed] = useState(false)

  useEffect(() => {
    // Đảm bảo loading hiển thị tối thiểu 800ms (smooth UX)
    const minTimer = setTimeout(() => setMinTimeElapsed(true), 800)
    // Timeout fallback 5s - tránh loading mãi mãi nếu có lỗi
    const maxTimer = setTimeout(() => setMaxTimeElapsed(true), 5000)
    
    return () => {
      clearTimeout(minTimer)
      clearTimeout(maxTimer)
    }
  }, [])

  // Hiển thị loading nếu:
  // - Chưa đủ thời gian tối thiểu HOẶC
  // - App chưa ready (và chưa timeout)
  const showLoading = !minTimeElapsed || (!isAppReady && !maxTimeElapsed)

  return (
    <div className="h-full w-full overflow-hidden relative">
      {/* Loading screen với fade out transition */}
      <div
        className={`fixed inset-0 z-[9999] transition-opacity duration-500 ${
          showLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <LoadingScreenZen isLoading={true} />
      </div>

      {/* App render ngầm bên dưới, sẵn sàng hiển thị khi loading ẩn */}
      <Suspense fallback={null}>
        <App />
      </Suspense>
    </div>
  )
}

export default function AppLoader() {
  return (
    <AppReadyProvider>
      <AppLoaderInner />
    </AppReadyProvider>
  )
}
