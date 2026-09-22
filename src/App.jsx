import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import TestContainer from "./pages/TestContainer";
import ResultDashboard from "./pages/ResultDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/test" element={<TestContainer />} />
      <Route path="/results/:uuid" element={<ResultDashboard />} />
    </Routes>
  );
}