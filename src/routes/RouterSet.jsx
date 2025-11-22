import { Navigate, Route, Routes } from "react-router-dom";
import Signin from "../pages/signin/Signin";
import MainLayout from "../pages/mainLayout/mainLayout";
import Dashboard from "../pages/Dashboard/dashboard";
import UserMangement from "../pages/userManagement/User mangement";
import IdVerification from "../pages/idVerification/IdVerification";
import PendingIds from "../pages/pendingId/PendingIds";
import ReportAnalytic from "../pages/reportAnalitic/ReportAnalytic";
import PersonalDetails from "../pages/personalDetails/personalDetails";
import AdminPanel from "../pages/AdminiPanel/AdminPanel";
import DigitalIdentityForm from "../pages/signin/DigitalIdentityForm";
import DigitalIdentityBookingPage from "../pages/signin/BookingDate";
import Organization from "../pages/Organization/organization";
import Permission from "../pages/PermissionTemplete/permission";
import OrganizationManagment from "../pages/OrganizationManagment/organizationManagment";
import DrivingLicenseRequest from "../pages/InitialReqqust/drivingLicenseRequest";
import LicenseIssuanceForm from "../pages/InitialReqqust/LicenseIssuanceForm";
import PendingRequest from "../pages/InitialReqqust/pendingRequest";
import IssuedLicense from "../pages/InitialReqqust/issuedLicense";
import { useSelector } from "react-redux";

export default function RouterSet() {
  const token = useSelector((state) => state.auth.token);
  return (
    <Routes>
      {/* Sign-in route is separate from MainLayout */}
      <Route path="/sign-in" element={<Signin />} />

      {/* Redirect root to sign-in */}
      <Route path="/" element={<Navigate to="/sign-in" replace />} />

      {token !== null && token !== "" ? (
        <Route path="/" element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="usermangemnt" element={<UserMangement />} />
          <Route path="idverification" element={<IdVerification />} />
          <Route path="pending" element={<PendingIds />} />
          <Route path="analatic" element={<ReportAnalytic />} />
          <Route path="personalDetails" element={<PersonalDetails />} />
          <Route path="organization" element={<Organization />} />
          <Route path="permission" element={<Permission />} />
          <Route path="organizationUser" element={<OrganizationManagment />} />
          <Route path="licenseReqqust" element={<DrivingLicenseRequest />} />
          <Route path="licenseIssue" element={<LicenseIssuanceForm />} />
          <Route path="pendingIssue" element={<PendingRequest />} />
          <Route path="issuedLicenses" element={<IssuedLicense />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/sign-in" />} />
      )}

      {/* All routes that use MainLayout */}

      <Route path="/admin" element={<AdminPanel />} />
      <Route path="digitalIdentity" element={<DigitalIdentityBookingPage />} />
      <Route path="digitalIdentity/form" element={<DigitalIdentityForm />} />
    </Routes>
  );
}
