import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ScrollToTop } from '@/components/common/ScrollToTop'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { RootLayout } from '@/components/layout/RootLayout'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

// Basic Loading Spinner for Suspense Fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
  </div>
)

// Auth Pages (Lazy Loaded)
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const TestDataViewer = lazy(() => import('@/pages/admin/TestDataViewer'))

// Customer Pages (Lazy Loaded)
const HomePage = lazy(() => import('@/pages/customer/HomePage'))
const AboutPage = lazy(() => import('@/pages/customer/AboutPage'))
const ServicesPage = lazy(() => import('@/pages/customer/ServicesPage'))
const ServiceDetailPage = lazy(() => import('@/pages/customer/ServiceDetailPage'))
const ContactPage = lazy(() => import('@/pages/customer/ContactPage'))
const JoinUsPage = lazy(() => import('@/pages/customer/JoinUsPage'))
const BookingPage = lazy(() => import('@/pages/customer/BookingPage'))
const PaymentPage = lazy(() => import('@/pages/customer/PaymentPage'))
const TrackingPage = lazy(() => import('@/pages/customer/TrackingPage'))
const BookingHistoryPage = lazy(() => import('@/pages/customer/BookingHistoryPage'))
const ChatPage = lazy(() => import('@/pages/customer/ChatPage'))
const ProfilePage = lazy(() => import('@/pages/customer/ProfilePage'))

// Admin Pages (Lazy Loaded)
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminTechniciansPage = lazy(() => import('@/pages/admin/AdminTechniciansPage'))
const AdminBookingsPage = lazy(() => import('@/pages/admin/AdminBookingsPage'))
const AdminServicesPage = lazy(() => import('@/pages/admin/AdminServicesPage'))
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminSettingsPage'))

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Auth Routes (no header/footer) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/test/data" element={<TestDataViewer />} />

            {/* Public Routes with Header/Footer — accessible to ALL users */}
            <Route element={<RootLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:id" element={<ServiceDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/join-us" element={<JoinUsPage />} />

              {/* Protected Routes — require login, same for all users */}
              <Route
                path="/booking/new"
                element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/booking/:id/payment"
                element={
                  <ProtectedRoute>
                    <PaymentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/booking/:id/tracking"
                element={
                  <ProtectedRoute>
                    <TrackingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    <BookingHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat/:bookingId"
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Admin Dashboard Routes */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/technicians" element={<AdminTechniciansPage />} />
              <Route path="/admin/bookings" element={<AdminBookingsPage />} />
              <Route path="/admin/services" element={<AdminServicesPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
