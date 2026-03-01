import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./AppRouter.tsx";
import { AuthProvider } from "./providers/AuthProvider.tsx";
import { SocketProvider } from "./providers/SocketProvider.tsx";
import { CategoryProvider } from "./providers/CategoryProvider.tsx";
import { AIParserProvider } from "./providers/AIParserProvider.tsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createAppTheme } from "@/common/utils/theme.utils.ts";
import { useSystemStore } from "@/stores/system.store";

function App() {
  const mode = useSystemStore((state) => state.mode);
  const theme = createAppTheme(mode);

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <SocketProvider>
            <CategoryProvider>
              <AIParserProvider>
                <AppRouter />
              </AIParserProvider>
            </CategoryProvider>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
