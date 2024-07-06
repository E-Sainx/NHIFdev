// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dapp from './components/Dapp';
import Providers from './components/providers/Providers';
import { Members } from './components/Members';
import Admin from './components/admin/Admin';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/members" element={<Members />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
