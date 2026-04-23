import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Schedule from "./pages/Schedule";
import TeamMemeber from "./pages/Team Memeber";
import Reporting from "./pages/Reporting";
import SettingsPage from "./pages/library";
import Announcements from "./pages/Announcements";
import Login from "./pages/Login";
import ScriptureWall from "./pages/ScriptureWall";

// Root app - sets up providers, routing, and auth-protected routes

// Single shared React Query client used across the whole app
const queryClient = new QueryClient();

// Redirects to /login if no user or token is stored in localStorage
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// All app routes - every path except /login is wrapped in ProtectedRoute
const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      }
    />
    <Route
      path="/schedule"
      element={
        <ProtectedRoute>
          <Schedule />
        </ProtectedRoute>
      }
    />
    <Route
      path="/announcements"
      element={
        <ProtectedRoute>
          <Announcements />
        </ProtectedRoute>
      }
    />
    <Route
      path="/teammembers"
      element={
        <ProtectedRoute>
          <TeamMemeber />
        </ProtectedRoute>
      }
    />
    <Route
      path="/reporting"
      element={
        <ProtectedRoute>
          <Reporting />
        </ProtectedRoute>
      }
    />
    <Route
      path="/library"
      element={
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/scripture-wall"
      element={
        <ProtectedRoute>
          <ScriptureWall />
        </ProtectedRoute>
      }
    />
  </Routes>
);

// Renders routes without the sidebar on the login page, with it on all others
const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return isLoginPage ? (
    <AppRoutes />
  ) : (
    <Layout>
      <AppRoutes />
    </Layout>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}