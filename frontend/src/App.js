import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dapp from './components/Dapp';
import Members from './components/members/Members';
import Providers from './components/providers/Providers';
import Admin from './components/admin/Admin';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Layout>
          <Routes>
            <Route path="/members/landing" element={<Members />} />
            <Route path="/providers/landing" element={<Providers />} />
            <Route path="/admin/landing" element={<Admin />} />
            <Route path="/" element={<Dapp />} />
          </Routes>
        </Layout>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
