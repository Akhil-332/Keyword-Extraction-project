import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import DocumentAnalysis from './pages/DocumentAnalysis'
import AIChat from './pages/AIChat'
import History from './pages/History'
import Navbar from './components/Navbar'

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen bg-slate-950 text-slate-50 font-sans overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<div className="p-10 h-full overflow-y-auto"><Dashboard /></div>} />
            <Route path="/analysis/:docId" element={<DocumentAnalysis />} />
            <Route path="/chat/:docId" element={<AIChat />} />
            <Route path="/history" element={<div className="p-10 h-full overflow-y-auto"><History /></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
