import { Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar"
import Solve from "@/pages/Solve";
import Benchmark from "@/pages/Benchmark";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Solve />} />
        <Route path="/benchmark" element={<Benchmark />} />
      </Routes>
    </div>
  );
}