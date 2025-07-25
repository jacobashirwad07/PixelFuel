import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Services from './pages/Services/Services';
import ServiceList from './pages/Services/ServiceList';
import Games from './pages/Games/Games';
import BookingForm from './pages/Booking/BookingForm';
import PaymentPage from './pages/Payment/PaymentPage';
import PaymentSuccess from './pages/Payment/PaymentSuccess';
import BookingDashboard from './pages/Bookings/BookingDashboard';
import ReviewForm from './pages/Reviews/ReviewForm';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Profile from './pages/Profile/Profile';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/games" element={<Games />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/category/:category" element={<ServiceList />} />
              <Route path="/services/:serviceId/book" element={
                <ProtectedRoute>
                  <BookingForm />
                </ProtectedRoute>
              } />
              <Route path="/bookings/:bookingId/payment" element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              } />
              <Route path="/bookings/:bookingId/success" element={
                <ProtectedRoute>
                  <PaymentSuccess />
                </ProtectedRoute>
              } />
              <Route path="/bookings" element={
                <ProtectedRoute>
                  <BookingDashboard />
                </ProtectedRoute>
              } />
              <Route path="/bookings/:bookingId/review" element={
                <ProtectedRoute>
                  <ReviewForm />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/coaches" element={<div className="container" style={{ padding: '2rem', textAlign: 'center' }}><h2>🏆 Gaming Coaches</h2><p>Find expert gaming coaches to improve your skills</p></div>} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;