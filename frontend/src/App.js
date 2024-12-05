import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignupForm from './components/LoginSignupForm';
import PlayerDashboard from './components/PlayerDashboard';
import Scoreboard from './components/Scoreboard';
import AnswerQueries from './components/AnswerQueries';
import DesignerDashboard from './components/DesignerDashboard';
import DesignerBoard from './components/DesignerBoard';
import CategoryManagement from './components/CategoryManagement';
import QueryManagement from './components/QueryManagement';

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<LoginSignupForm />} />

              <Route path="/signup" element={<LoginSignupForm isSignup />} />

              <Route path="/player" element={<PlayerDashboard />} />
              <Route path="/scoreboard" element={<Scoreboard />} />
              <Route path="/answer-queries" element={<AnswerQueries />} />

              <Route path="/designer" element={<DesignerDashboard />} />
              <Route path="/category-management" element={<CategoryManagement />} />
              <Route path="/query-management" element={<QueryManagement />} />

              <Route path="/designerboard" element={<DesignerBoard />} />
          </Routes>
      </Router>
  );
}

export default App;
