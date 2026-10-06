import { Routes, Route, Navigate } from "react-router-dom";
import Splash from "./pages/Splash";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Pricing from "./pages/Pricing";
import Payment from "./pages/Payment";
import Payments from "./pages/Payments";
import Profile from "./pages/Profile";
import TestContainer from "./pages/TestContainer";
import ResultDashboard from "./pages/ResultDashboard";
import Certificate from "./pages/Certificate";
import AIAdvisor from "./pages/AIAdvisor";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/pricing" element={<Pricing />} />

      {/* Protected routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Landing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        }
      />

      {/* Test routes */}
      <Route
        path="/test"
        element={
          <ProtectedRoute>
            <TestContainer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/test/:category"
        element={
          <ProtectedRoute>
            <TestContainer />
          </ProtectedRoute>
        }
      />

      {/* Results */}
      <Route
        path="/results/:uuid"
        element={
          <ProtectedRoute>
            <ResultDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/certificate/:uuid"
        element={
          <ProtectedRoute>
            <Certificate />
          </ProtectedRoute>
        }
      />

      {/* AI Advisor */}
      <Route
        path="/ai-advisor"
        element={
          <ProtectedRoute>
            <AIAdvisor />
          </ProtectedRoute>
        }
      />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}