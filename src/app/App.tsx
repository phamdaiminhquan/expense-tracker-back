import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./AppRouter.tsx";
import { AuthProvider } from "./providers/AuthProvider.tsx";
import { CategoryProvider } from "./providers/CategoryProvider.tsx";
import { AIParserProvider } from "./providers/AIParserProvider.tsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createAppTheme } from "@/common/utils/theme.utils.ts";
import { GlobalReduxState } from "@/redux/store.interface.ts";
import { useSelector } from "react-redux";
// import "@/assets/css/App.css";

function App() {
  const system = useSelector((state: GlobalReduxState) => state.system);
  const theme = createAppTheme(system.mode);

  // PersistGate trong main.tsx đã xử lý loading, không cần loading ở đây
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
          <CategoryProvider>
            <AIParserProvider>
              <AppRouter />
            </AIParserProvider>
          </CategoryProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
