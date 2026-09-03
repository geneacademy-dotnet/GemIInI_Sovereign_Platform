import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { LanguageProvider } from '@/i18n/LanguageContext';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ServicesPage from '@/pages/ServicesPage';
import CoursesPage from '@/pages/CoursesPage';
import CourseDetailPage from '@/pages/CourseDetailPage';
import ResourcesPage from '@/pages/ResourcesPage';
import VerifyPage from '@/pages/VerifyPage';
import CertificationsPage from '@/pages/CertificationsPage';
import RegisterPage from '@/pages/RegisterPage';
import ContactPage from '@/pages/ContactPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import DashboardPage from '@/pages/DashboardPage';
import CommunitiesPage from '@/pages/CommunitiesPage';
import QuizPage from '@/pages/QuizPage';
import ProfilePage from '@/pages/ProfilePage';
import BlsWorkshopPage from '@/pages/BlsWorkshopPage';
import MediaVaultPage from '@/pages/MediaVaultPage';

function App() {
    return (
        <LanguageProvider>
            <AuthProvider>
                <Router>
                    <ScrollToTop />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/services" element={<ServicesPage />} />
                        <Route path="/courses" element={<CoursesPage />} />
                        <Route path="/courses/:slug" element={<CourseDetailPage />} />
                        <Route path="/resources" element={<ResourcesPage />} />
                        <Route path="/verify" element={<VerifyPage />} />
                        <Route path="/certifications" element={<CertificationsPage />} />
                        <Route path="/register" element={<RegisterPage />} />
        <Route path="/join" element={<RegisterPage />} />
                        <Route path="/bls" element={<BlsWorkshopPage />} />
        <Route path="/register/bls" element={<BlsWorkshopPage />} />
        <Route path="/register/sudan" element={<BlsWorkshopPage />} />
        <Route path="/landing" element={<HomePage />} />
        <Route path="/media" element={<MediaVaultPage />} />
        <Route path="/vault" element={<MediaVaultPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <DashboardPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/communities"
                            element={
                                <ProtectedRoute>
                                    <CommunitiesPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/quiz/:quizId"
                            element={
                                <ProtectedRoute>
                                    <QuizPage />
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
                    </Routes>
                </Router>
            </AuthProvider>
        </LanguageProvider>
    );
}

export default App;
