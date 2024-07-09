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
          <Route path="/members/landing" element={<Members />} />
          <Route path="provider/landing" element={<Providers />} />
          <Route path="/admin/landing" element={<Admin />} />

        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
