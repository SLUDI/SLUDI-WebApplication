import { Navigate, Route, Routes } from "react-router-dom";
import Signin from "../pages/signin/Signin";
import MainLayout from "../pages/mainLayout/mainLayout";
import Dashboard from "../pages/Dashboard/dashboard";
import UserMangement from "../pages/userManagement/User mangement";
import IdVerification from "../pages/idVerification/idVerification";
import PendingIds from "../pages/pendingId/PendingIds";
import ReportAnalytic from "../pages/reportAnalitic/reportAnalytic";
import PersonalDetails from "../pages/personalDetails/personalDetails";
import AdminPanel from "../pages/AdminiPanel/AdminPanel";
import DigitalIdentityForm from "../pages/signin/DigitalIdentityForm";
import DigitalIdentityBookingPage from "../pages/signin/BookingDate";

export default function RouterSet() {
  return (
    <Routes>
      {/* Sign-in route is separate from MainLayout */}
      <Route path="/sign-in" element={<Signin />} />

      {/* Redirect root to sign-in */}
      <Route path="/" element={<Navigate to="/sign-in" replace />} />

      {/* All routes that use MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="usermangemnt" element={<UserMangement />} />
        <Route path="idverification" element={<IdVerification />} />
        <Route path="pending" element={<PendingIds />} />
        <Route path="analatic" element={<ReportAnalytic />} />
        <Route path="personalDetails" element={<PersonalDetails />} />
      </Route>
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="digitalIdentity" element={<DigitalIdentityBookingPage />} />
      <Route path="digitalIdentity/form" element={<DigitalIdentityForm />} />
    </Routes>
  );
}
