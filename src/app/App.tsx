import { BrowserRouter } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { AppRouter } from './AppRouter.tsx'
import { AuthProvider } from './providers/AuthProvider.tsx'
import { CategoryProvider } from './providers/CategoryProvider.tsx'
import { AIParserProvider } from './providers/AIParserProvider.tsx'
import { MessageProvider } from './providers/MessageProvider.tsx'
import { LogoComponent } from '@/components/components/logo/logo.component.tsx'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <AuthProvider>
          <CategoryProvider>
            <AIParserProvider>
              <MessageProvider>
                <AppRouter />
              </MessageProvider>
            </AIParserProvider>
          </CategoryProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
