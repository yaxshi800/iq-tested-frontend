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
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/pricing" element={<Pricing />} />

      <Route path="/home" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
      <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
      <Route path="/test" element={<ProtectedRoute><TestContainer /></ProtectedRoute>} />
      <Route path="/results/:uuid" element={<ProtectedRoute><ResultDashboard /></ProtectedRoute>} />
      <Route path="/certificate/:uuid" element={<ProtectedRoute><Certificate /></ProtectedRoute>} />
      <Route path="/ai-advisor" element={<ProtectedRoute><AIAdvisor /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}