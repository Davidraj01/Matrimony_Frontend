import Sidebar from "../components/Sidebar";
import WeddingBackground from "../components/WeddingBackground";
import CoupleBackdrop from "../components/CoupleBackdrop";
import PageTransition from "../components/PageTransition";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function MainLayout() {
  const navigate = useNavigate();
  useEffect(() => {
    // The "isVerified" localStorage flag is only ever set after actually
    // completing verification, so it's unset (not "false") for a normal
    // returning login and this check never fired. user.isPhoneVerified —
    // returned by /auth/login and kept in sync by MobileVerification — is
    // the reliable source of truth.
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch {
      user = null;
    }

    if (user && user.isPhoneVerified === false) {
      navigate("/mobileverify");
    }
  }, [navigate]);
  return (
    <div className="flex w-full overflow-x-hidden">
      {/* Wedding Animations Background */}
      <CoupleBackdrop opacity={0.22} />
      <WeddingBackground density="normal" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="relative z-10 flex-1 w-full md:ml-64 pt-16 md:pt-6 p-3 sm:p-4 md:p-6 min-h-screen overflow-x-hidden">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </div>

      {/* Mobile Bottom Nav */}
      {/* <MobileNav /> */}
    </div>
  );
}
