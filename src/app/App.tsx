import { BrowserRouter } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { AppRouter } from './AppRouter.tsx'
import { AuthProvider } from './providers/AuthProvider.tsx'
import { CategoryProvider } from './providers/CategoryProvider.tsx'
import { AIParserProvider } from './providers/AIParserProvider.tsx'
import { FundProvider } from './providers/FundProvider.tsx'
import { MessageProvider } from './providers/MessageProvider.tsx'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <AuthProvider>
        <FundProvider>
          <CategoryProvider>
            <AIParserProvider>
              <MessageProvider>
                <AppRouter />
              </MessageProvider>
            </AIParserProvider>
          </CategoryProvider>
        </FundProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
