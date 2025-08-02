import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home';
import Explore from './pages/Explore';
import CreateProject from './pages/CreateProject';

import Login from './pages/Login';
import Signup from './pages/Signup';
import ProjectPage from './pages/ProjectPage';
import CampaignList from './pages/CampaignList';
import MyCampaigns from './pages/MyCampaigns';

import CampaignDetail from './pages/CampaignDetail';
import MyDonations from './pages/MyDonations';
import MyProfile from './pages/MyProfile';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  const { token } = useAuth();
  return (
    <div className="min-h-screen bg-black text-white">
      {token && <Navbar />}
      <Routes>
        <Route
          path="/campaigns"
          element={
            <PrivateRoute>
              <CampaignList />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-campaigns"
          element={
            <PrivateRoute>
              <MyCampaigns />
            </PrivateRoute>
          }
        />
        <Route
          path="/campaign/:id"
          element={
            <PrivateRoute>
              <CampaignDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-donations"
          element={
            <PrivateRoute>
              <MyDonations />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <PrivateRoute>
              <Explore />
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:id"
          element={
            <PrivateRoute>
              <ProjectPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <CreateProject />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
                
        <Route path="/signup" element={<Signup />} />
                <Route
          path="/profile"
          element={
            <PrivateRoute>
              <MyProfile />
            </PrivateRoute>
          }
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
