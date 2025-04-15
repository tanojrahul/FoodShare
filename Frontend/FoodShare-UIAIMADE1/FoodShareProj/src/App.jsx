import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './HomePage'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import Dashboard from './Dashboard'
import FoodBrowsePage from './pages/FoodBrowsePage'
import DonationTrackingPage from './pages/DonationTrackingPage'
import DonationDetailsPage from './pages/DonationDetailsPage'
import ImpactReportPage from './pages/ImpactReportPage'
import AdminPanelPage from './pages/AdminPanelPage'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* HomePage has its own layout with navbar */}
        <Route path="/" element={<HomePage />} />
        
        {/* All other routes use the standard layout with navbar and footer */}
        <Route path="*" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard/:role" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/browse" element={<FoodBrowsePage />} />
                <Route path="/track/:donationId" element={<DonationTrackingPage />} />
                <Route path="/track" element={<DonationTrackingPage />} />
                <Route path="/donations/:donationId" element={<DonationDetailsPage />} />
                <Route path="/impact" element={<ImpactReportPage />} />
                <Route path="/admin" element={<AdminPanelPage />} />
                <Route path="/admin/custom-report" element={<div>Custom Report Builder (Coming Soon)</div>} />
                {/* 404 route - must be last */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  )
}

export default App
