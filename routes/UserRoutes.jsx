import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "../src/components/MainLayout.jsx";
import ProtectedRoute from "../src/components/ProtectedRoute.jsx";
import AdminRoute from "../src/components/AdminRoute.jsx";
import AdminLayout from "../src/components/admin/AdminLayout.jsx";

// Every page below is loaded on demand, per route, instead of all being
// bundled into the initial download — a first-time visitor to /login no
// longer pays for the admin panel, chat, or every other page in the app.
const Register = lazy(() => import("../src/pages/Register.jsx"));
const Login = lazy(() => import("../src/pages/Login.jsx"));
const ResetPassword = lazy(() => import("../src/pages/ResetPassword.jsx"));
const MobileVerification = lazy(() => import("../src/pages/MobileVerification.jsx"));
const Dashboard = lazy(() => import("../src/pages/Dashboard.jsx"));
const Matches = lazy(() => import("../src/pages/Matches.jsx"));
const Profile = lazy(() => import("../src/pages/Profile.jsx"));
const ProfileDetails = lazy(() => import("../src/pages/ProfileDetails.jsx"));
const Received = lazy(() => import("../src/pages/Received.jsx"));
const Sent = lazy(() => import("../src/pages/Sent.jsx"));
const Plans = lazy(() => import("../src/pages/Plans.jsx"));
const Chat = lazy(() => import("../src/pages/Chat.jsx"));
const Views = lazy(() => import("../src/pages/Views.jsx"));
const Shortlist = lazy(() => import("../src/pages/ShortList.jsx"));
const Blog = lazy(() => import("../src/pages/Blog.jsx"));
const BlogPost = lazy(() => import("../src/pages/BlogPost.jsx"));
const SuccessStories = lazy(() => import("../src/pages/SuccessStories.jsx"));
const EmailSupport = lazy(() => import("../src/pages/EmailSupport.jsx"));
const HelpCenter = lazy(() => import("../src/pages/HelpCenter.jsx"));
const AboutUs = lazy(() => import("../src/pages/AboutUs.jsx"));
const ContactUs = lazy(() => import("../src/pages/ContactUs.jsx"));
const RefundPolicy = lazy(() => import("../src/pages/RefundPolicy.jsx"));
const PrivacyPolicy = lazy(() => import("../src/pages/PrivacyPolicy.jsx"));
const TermsConditions = lazy(() => import("../src/pages/TermsConditions.jsx"));

const AdminDashboard = lazy(() => import("../src/pages/admin/AdminDashboard.jsx"));
const AdminUsers = lazy(() => import("../src/pages/admin/AdminUsers.jsx"));
const AdminProfiles = lazy(() => import("../src/pages/admin/AdminProfiles.jsx"));
const AdminPlans = lazy(() => import("../src/pages/admin/AdminPlans.jsx"));
const AdminBilling = lazy(() => import("../src/pages/admin/AdminBilling.jsx"));
const AdminReports = lazy(() => import("../src/pages/admin/AdminReports.jsx"));
const AdminStories = lazy(() => import("../src/pages/admin/AdminStories.jsx"));
const AdminBlogs = lazy(() => import("../src/pages/admin/AdminBlogs.jsx"));
const AdminNotifications = lazy(() => import("../src/pages/admin/AdminNotifications.jsx"));
const AdminSettings = lazy(() => import("../src/pages/admin/AdminSettings.jsx"));

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
    </div>
  );
}

export default function UserRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* AUTH */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mobileverify" element={<MobileVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/*  PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user/:id" element={<ProfileDetails />} />
            <Route path="/received" element={<Received />} />
            <Route path="/sent" element={<Sent />} />
            <Route path="/shortlist" element={<Shortlist />} />

            <Route path="/chat/:userId" element={<Chat />} />
            <Route path="/views" element={<Views />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/success-stories" element={<SuccessStories />} />

            <Route path="/email-support" element={<EmailSupport />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
          </Route>
        </Route>

        {/* ADMIN */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="profiles" element={<AdminProfiles />} />
            <Route path="plans" element={<AdminPlans />} />
            <Route path="billing" element={<AdminBilling />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="stories" element={<AdminStories />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
