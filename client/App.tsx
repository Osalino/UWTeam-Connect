// import "./global.css";
//
// import { Toaster } from "@/components/ui/toaster";
// import { createRoot } from "react-dom/client";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
// import { Layout } from "./components/Layout";
// import Index from "./pages/Index";
// import Dashboard from "./pages/Dashboard";
// import Schedule from "./pages/Schedule";
// import TeamMemeber from "./pages/Team Memeber";
// import Reporting from "./pages/Reporting";
// import SettingsPage from "./pages/library";
// import Announcements from "./pages/Announcements.tsx";
// import Login from "./pages/Login";
//
// const queryClient = new QueryClient();
//
// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const user = localStorage.getItem("user");
//   return user ? <>{children}</> : <Navigate to="/login" replace />;
// };
//
// const AppRoutes = () => (
//   <Routes>
//     <Route path="/login" element={<Login />} />
//     <Route
//       path="/"
//       element={
//         <ProtectedRoute>
//           <Index />
//         </ProtectedRoute>
//       }
//     />
//     <Route
//       path="/dashboard"
//       element={
//         <ProtectedRoute>
//           <Dashboard />
//         </ProtectedRoute>
//       }
//     />
//     <Route
//       path="/Schedule"
//       element={
//         <ProtectedRoute>
//           <Schedule />
//         </ProtectedRoute>
//       }
//     />
//     <Route
//       path="/TeamMembers"
//       element={
//         <ProtectedRoute>
//           <TeamMemeber />
//         </ProtectedRoute>
//       }
//     />
//     <Route
//       path="/reporting"
//       element={
//         <ProtectedRoute>
//           <Reporting />
//         </ProtectedRoute>
//       }
//     />
//     <Route
//       path="/library"
//       element={
//         <ProtectedRoute>
//           <SettingsPage />
//         </ProtectedRoute>
//       }
//     />
//     <Route
//       path="/support"
//       element={
//         <ProtectedRoute>
//           <Schedule />
//         </ProtectedRoute>
//       }
//     />
//     {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//     <Route
//       path="*"
//       element={
//         <ProtectedRoute>
//           <Announcements />
//         </ProtectedRoute>
//       }
//     />
//   </Routes>
// );
//
// const AppContent = () => {
//   const location = useLocation();
//   const isLoginPage = location.pathname === "/login";
//
//   return isLoginPage ? (
//     <AppRoutes />
//   ) : (
//     <Layout>
//       <AppRoutes />
//     </Layout>
//   );
// };
//
// const App = () => {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <TooltipProvider>
//         <Toaster />
//         <Sonner />
//         <BrowserRouter>
//           <AppContent />
//         </BrowserRouter>
//       </TooltipProvider>
//     </QueryClientProvider>
//   );
// };
//
// createRoot(document.getElementById("root")!).render(<App />);
// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Navigate,
//   useLocation,
// } from "react-router-dom";
// import { Layout } from "./components/Layout";
// import Index from "./client/Index.tsx";
// import Dashboard from "./pages/Dashboard";
// import Schedule from "./pages/Schedule";
// import TeamMemeber from "./pages/Team Memeber";
// import Reporting from "./pages/Reporting";
// import SettingsPage from "./pages/library";
// import Announcements from "./pages/Announcements";
// import Login from "./pages/Login";
//
// const queryClient = new QueryClient();
//
// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const user = localStorage.getItem("user");
//   return user ? <>{children}</> : <Navigate to="/login" replace />;
// };
//
// const AppRoutes = () => (
//   <Routes>
//     <Route path="/login" element={<Login />} />
//     <Route
//       path="/"
//       element={
//         <ProtectedRoute>
//           <Index />
//         </ProtectedRoute>
//       }
//     />
//     <Route
//       path="/dashboard"
//       element={
//         <ProtectedRoute>
//           <Dashboard />
//         </ProtectedRoute>
//       }
//     />
//     <Route
//       path="/schedule"
//       element={
//         <ProtectedRoute>
//           <Schedule />
//         </ProtectedRoute>
//       }
//     />
//     <Route
//       path="/teammembers"
//       element={
//         <ProtectedRoute>
//           <TeamMemeber />
//         </ProtectedRoute>
//       }
//     />
//     <Route
//       path="/reporting"
//       element={
//         <ProtectedRoute>
//           <Reporting />
//         </ProtectedRoute>
//       }
//     />
//     <Route
//       path="/library"
//       element={
//         <ProtectedRoute>
//           <SettingsPage />
//         </ProtectedRoute>
//       }
//     />
//     <Route
//       path="/support"
//       element={
//         <ProtectedRoute>
//           <Schedule />
//         </ProtectedRoute>
//       }
//     />
//     <Route
//       path="*"
//       element={
//         <ProtectedRoute>
//           <Announcements />
//         </ProtectedRoute>
//       }
//     />
//   </Routes>
// );
//
// const AppContent = () => {
//   const location = useLocation();
//   const isLoginPage = location.pathname === "/login";
//
//   return isLoginPage ? (
//     <AppRoutes />
//   ) : (
//     <Layout>
//       <AppRoutes />
//     </Layout>
//   );
// };
//
// export default function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <TooltipProvider>
//         <Toaster />
//         <Sonner />
//         <BrowserRouter>
//           <AppContent />
//         </BrowserRouter>
//       </TooltipProvider>
//     </QueryClientProvider>
//   );
// }

// export default function App() {
//   return <div>Hello from App</div>;
// }

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
import { Index } from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Schedule from "./pages/Schedule";
import TeamMemeber from "./pages/Team Memeber";
import Reporting from "./pages/Reporting";
import SettingsPage from "./pages/library";
import Announcements from "./pages/Announcements";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem("user");
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

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
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
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
      path="/support"
      element={
        <ProtectedRoute>
          <Schedule />
        </ProtectedRoute>
      }
    />
    <Route
      path="*"
      element={
        <ProtectedRoute>
          <Announcements />
        </ProtectedRoute>
      }
    />
  </Routes>
);

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
//
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Index from "./pages/Index";
//
// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Index />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }