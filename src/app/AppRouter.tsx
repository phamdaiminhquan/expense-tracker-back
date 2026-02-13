import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useParams, useLocation } from "react-router-dom";
import { RequireAuth } from "@/routes/require-auth.route";
import { useAuth } from "@/hooks/use-auth";
import LoadingScreenZen from "@/components/elements/screen/screen-loading-zen.element";
import { motion, AnimatePresence } from "framer-motion";

// Lazy-loaded routes — each becomes its own chunk
const LoginRoute = lazy(() =>
  import("@/routes/login.route").then((m) => ({ default: m.LoginRoute }))
);
const MessageRoute = lazy(() =>
  import("@/routes/message.route").then((m) => ({ default: m.MessageRoute }))
);
const InvitePage = lazy(() =>
  import("@/pages/invite/invite.page").then((m) => ({ default: m.InvitePage }))
);

// Redirect component for legacy /funds/:fundId route
function LegacyFundRedirect() {
  const { fundId } = useParams();
  return <Navigate to={`/chat/${fundId}`} replace />;
}

// Lightweight fallback for Suspense
function RouteFallback() {
  return <LoadingScreenZen isLoading={true} />;
}

// Page transition wrapper
const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" as const } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeIn" as const } },
};

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ width: "100%", height: "100%" }}
    >
      {children}
    </motion.div>
  );
}

export function AppRouter() {
  const { isAuthed } = useAuth();
  const location = useLocation();

  // Only animate on top-level route changes (login ↔ chat ↔ invite)
  const routeKey = location.pathname.split("/")[1] || "root";

  return (
    <Suspense fallback={<RouteFallback />}>
      <AnimatePresence mode="wait">
        <AnimatedPage key={routeKey}>
          <Routes location={location}>
            <Route path="/login" element={<LoginRoute />} />

            {/* Public invite route */}
            <Route path="/invite/:fundId" element={<InvitePage />} />

            {/* Chat is now the main screen */}
            <Route
              path="/chat"
              element={
                <RequireAuth>
                  <MessageRoute />
                </RequireAuth>
              }
            />

            <Route
              path="/chat/:fundId"
              element={
                <RequireAuth>
                  <MessageRoute />
                </RequireAuth>
              }
            />

            {/* Legacy routes - redirect to chat */}
            <Route
              path="/funds"
              element={
                <RequireAuth>
                  <Navigate to="/chat" replace />
                </RequireAuth>
              }
            />

            <Route
              path="/funds/:fundId"
              element={
                <RequireAuth>
                  <LegacyFundRedirect />
                </RequireAuth>
              }
            />

            <Route
              path="*"
              element={<Navigate to={isAuthed ? "/chat" : "/login"} replace />}
            />
          </Routes>
        </AnimatedPage>
      </AnimatePresence>
    </Suspense>
  );
}
