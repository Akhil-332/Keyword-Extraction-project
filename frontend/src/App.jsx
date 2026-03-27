import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import DocumentAnalysis from './pages/DocumentAnalysis'
import AIChat from './pages/AIChat'
import History from './pages/History'
import Sidebar from './components/Sidebar'
console.log("hello world")

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-950 text-slate-50 font-sans">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analysis/:docId" element={<DocumentAnalysis />} />
            <Route path="/chat/:docId" element={<AIChat />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
