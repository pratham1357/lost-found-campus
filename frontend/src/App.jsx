import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ReportLost from './pages/ReportLost';
import ReportFound from './pages/ReportFound';
import MySubmissions from './pages/MySubmissions';
import ItemDetails from './pages/ItemDetails';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/item/:id" element={<ItemDetails />} />
            
            <Route
              path="/report-lost"
              element={
                <ProtectedRoute>
                  <ReportLost />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report-found"
              element={
                <ProtectedRoute>
                  <ReportFound />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-submissions"
              element={
                <ProtectedRoute>
                  <MySubmissions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;// Frontend integration commit 
