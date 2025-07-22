import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../src/components/Navbar.jsx";
import Dashboard from "../src/pages/Dashboard";
import { useEffect } from 'react';


export default function App() {
  useEffect(() => {
    document.title = "Prime Media (TEST)";
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow p-6 bg-gray-50">
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>

        <footer className="bg-gray-200 text-center p-4">© 2025 Prime Media (TEST)</footer>
      </div>
    </BrowserRouter>
  );
}
