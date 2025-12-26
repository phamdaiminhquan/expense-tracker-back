import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import AppLoader from './AppLoader';
import { ErrorFallback } from './ErrorFallback.tsx'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <AppLoader />
  </ErrorBoundary>
)
