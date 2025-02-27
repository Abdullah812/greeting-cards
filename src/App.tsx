import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CardEditor from './components/CardEditor';
import CardView from './components/CardView';
import Header from './components/Header';
import Footer from './components/Footer';
import { CardProvider } from './context/CardContext';
import StepByStepEditor from './components/StepByStepEditor';

function App() {
  return (
    <CardProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-50 text-right" dir="rtl">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/editor/:id?" element={<CardEditor />} />
              <Route path="/create" element={<StepByStepEditor />} />
              <Route path="/view/:id" element={<CardView />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CardProvider>
  );
}

export default App;