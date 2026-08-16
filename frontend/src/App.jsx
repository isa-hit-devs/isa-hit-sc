import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import Members from './pages/Members';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import AdminPortal from './pages/AdminPortal';

function MainLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-white font-sans text-slate-900 m-0 p-0 overflow-x-hidden flex flex-col justify-between">
      <NavBar />
      {children}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/events"
          element={
            <MainLayout>
              <Events />
            </MainLayout>
          }
        />
        <Route
          path="/members"
          element={
            <MainLayout>
              <Members />
            </MainLayout>
          }
        />
        <Route
          path="/post/:id"
          element={
            <MainLayout>
              <PostDetail />
            </MainLayout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPortal />} />
      </Routes>
    </Router>
  );
}

export default App;
