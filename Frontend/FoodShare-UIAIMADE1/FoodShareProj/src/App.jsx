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
import CreateDonationPage from './pages/CreateDonationPage'
import MyDonationsPage from './pages/MyDonationsPage'
import DonationRequestsPage from './pages/DonationRequestsPage'
import CompletedDonationsPage from './pages/CompletedDonationsPage'
import MyRequestsPage from './pages/MyRequestsPage'
import ImpactReportPage from './pages/ImpactReportPage'
import AdminPanelPage from './pages/AdminPanelPage'
import AdminReportsPage from './pages/AdminReportsPage'
import AdminSupportPage from './pages/AdminSupportPage'
import EventsPage from './pages/EventsPage'
import NotFoundPage from './pages/NotFoundPage'
import ErrorBoundary from './components/ErrorBoundary'
import RoleSwitcher from './components/RoleSwitcher'
import './App.css'

// Main layout component with Navbar and Footer
const MainLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <div className="flex-grow">
      {children}
    </div>
    <Footer />
    {/* Add RoleSwitcher component for development */}
    {/* {import.meta.env.DEV && <RoleSwitcher />} */}
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* HomePage gets special treatment - no layout wrapper */}
        <Route path="/" element={<HomePage />} />
        
        {/* All other routes use the standard layout */}
        <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
        <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />
        
        {/* Dashboard routes */}
        <Route path="/dashboard/:role" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        
        {/* Donation browsing & view details */}
        <Route path="/browse" element={
          <MainLayout>
            <ErrorBoundary>
              <FoodBrowsePage />
            </ErrorBoundary>
          </MainLayout>
        } />
        <Route path="/donations/:donationId" element={<MainLayout><DonationDetailsPage /></MainLayout>} />
        
        {/* Donor routes */}
        <Route path="/donations" element={
          <MainLayout>
            <ErrorBoundary>
              <MyDonationsPage />
            </ErrorBoundary>
          </MainLayout>
        } />
        <Route path="/donations/create" element={
          <MainLayout>
            <ErrorBoundary>
              <CreateDonationPage />
            </ErrorBoundary>
          </MainLayout>
        } />
        <Route path="/donations/completed" element={
          <MainLayout>
            <ErrorBoundary>
              <CompletedDonationsPage />
            </ErrorBoundary>
          </MainLayout>
        } />
        <Route path="/donation-requests" element={
          <MainLayout>
            <ErrorBoundary>
              <DonationRequestsPage />
            </ErrorBoundary>
          </MainLayout>
        } />
        
        {/* Beneficiary routes */}
        <Route path="/my-requests" element={
          <MainLayout>
            <ErrorBoundary>
              <MyRequestsPage />
            </ErrorBoundary>
          </MainLayout>
        } />
        <Route path="/my-claims" element={
          <MainLayout>
            <ErrorBoundary>
              <MyRequestsPage type="claims" />
            </ErrorBoundary>
          </MainLayout>
        } />
        <Route path="/request-history" element={
          <MainLayout>
            <ErrorBoundary>
              <MyRequestsPage type="history" />
            </ErrorBoundary>
          </MainLayout>
        } />
        
        {/* Tracking routes */}
        <Route path="/donations/tracking/:donationId" element={<MainLayout><DonationTrackingPage /></MainLayout>} />
        <Route path="/donations/tracking" element={<MainLayout><DonationTrackingPage /></MainLayout>} />
        <Route path="/track/:donationId" element={<MainLayout><DonationTrackingPage /></MainLayout>} />
        <Route path="/track" element={<MainLayout><DonationTrackingPage /></MainLayout>} />
        
        {/* Reviews & community routes */}
        <Route path="/reviews" element={
          <MainLayout>
            <ErrorBoundary>
              <div>My Reviews (Coming Soon)</div>
            </ErrorBoundary>
          </MainLayout>
        } />
        <Route path="/community" element={
          <MainLayout>
            <ErrorBoundary>
              <div>Community Page (Coming Soon)</div>
            </ErrorBoundary>
          </MainLayout>
        } />
        
        {/* Impact & reports */}
        <Route path="/impact" element={<MainLayout><ImpactReportPage /></MainLayout>} />
        
        {/* NGO Events Page */}
        <Route path="/events" element={
          <MainLayout>
            <ErrorBoundary>
              <EventsPage />
            </ErrorBoundary>
          </MainLayout>
        } />
        
        {/* Admin routes */}
        <Route path="/admin" element={<MainLayout><AdminPanelPage /></MainLayout>} />
        <Route path="/admin/reports" element={<MainLayout><AdminReportsPage /></MainLayout>} />
        <Route path="/admin/support" element={<MainLayout><AdminSupportPage /></MainLayout>} />
        <Route path="/admin/custom-report" element={<MainLayout><div>Custom Report Builder (Coming Soon)</div></MainLayout>} />
        
        {/* 404 route - must be last */}
        <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
      </Routes>
    </Router>
  )
}

export default App
