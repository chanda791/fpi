import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ReactElement } from "react";

import Home from "./pages/Home";
import Contact from "./pages/contact/Contact";import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ActivitiesList from "./pages/Activities";
import ActivityDetail from "./pages/ActivityDetail";
import Login from "./pages/admin/Login";
import ForgotPassword from "./pages/admin/ForgotPassword";
import ResetPassword from "./pages/admin/ResetPassword";
import { Navigate } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import Activities from "./pages/admin/Activities";
import CreateActivity from "./pages/admin/CreateActivity";
import EditActivity from "./pages/admin/EditActivity";
import Hubs from "./pages/mil/Hubs";
import AllHubs from "./pages/mil/Hubs/AllHubs";
import Brochure from "./pages/mil/Brochure";
import AboutMIL from "./pages/mil/AboutMIL";
import About from "./pages/about/AboutUs";
import Team from "./pages/team/Team";
import Sponsors from "./pages/sponsors/Sponsors";
import Partners from "./pages/partners/Partners";
import Donors from "./pages/donors/Donors";
import Advocacy from "./pages/programs/Advocacy";
import MediaLiteracy from "./pages/programs/MediaLiteracy";
import Research from "./pages/programs/Research";
import CapacityBuilding from "./pages/programs/CapacityBuilding";
import Programs from "./pages/programs/Programs";
import Newsletters from "./pages/knowledge/Newsletters";
import Reports from "./pages/knowledge/Reports";
import AdminReports from "./pages/admin/Report";
import CreateReport from "./pages/admin/CreateReport";
import EditReport from "./pages/admin/EditReport";
import TeamMembers from "./pages/admin/TeamMembers";
import Projects from "./pages/admin/Projects";
import CreateProject from "./pages/admin/CreateProject";
import ProjectDetail from "./pages/Projects/ProjectDetail";
import HubDetail from "./pages/mil/Hubs/HubDetail";
import AdminHubs from "./pages/admin/Hubs";
import HubEvents from "./pages/admin/HubEvents";
import HubPhotos from "./pages/admin/HubPhotos";
import Provinces from "./pages/admin/Provinces";
import CreateHub from "./pages/admin/CreateHub";
import ProvinceHubs from "./pages/mil/Hubs/ProvinceHubs";
import EditHub from "./pages/admin/EditHub";
import ScrollToTop from "./components/ScrollToTop";
import Resources from "./pages/resources/Resources";
import Publications from "./pages/knowledge/Publications";
import PressStatements from "./pages/knowledge/PressStatements";
import EditProject from "./pages/admin/EditProject";
import MediaLibrary from "./pages/admin/media/MediaLibrary";
import UploadMedia from "./pages/admin/media/UploadMedia";
import EditMedia from "./pages/admin/media/EditMedia";
import CreateTeam from "./pages/admin/CreateTeam";
import EditTeam from "./pages/admin/EditTeam";
import RadioSpots from "./pages/mil/RadioSpots";
import SheRise from "./pages/Projects/SheRise";
import ClaimYourSpace from "./pages/Projects/ClaimYourSpace";
import Funsani from "./pages/Projects/Funsani";
import ConflictSensitiveJournalism from "./pages/Projects/ConflictSensitiveJournalism";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Homepage from "./pages/admin/Homepage";
import RadioSpotsAdmin from "./pages/admin/RadioSpots";
import NewslettersAdmin from "./pages/admin/Newsletters";
import PublicationsAdmin from "./pages/admin/Publications";
import PressStatementsAdmin from "./pages/admin/PressStatements";
import CreatePressStatement from "./pages/admin/CreatePressStatement";
import EditPressStatement from "./pages/admin/EditPressStatement";
import EditPublication from "./pages/admin/EditPublication";
import CreatePublication from "./pages/admin/CreatePublication";
import CreateNewsletter from "./pages/admin/CreateNewsletter";
import EditNewsletter from "./pages/admin/EditNewsletter";

import CreateRadioSpot from "./pages/admin/CreateRadioSpot";
import EditRadioSpot from "./pages/admin/EditRadioSpot";

import Settings from "./pages/admin/Settings";
import UsersPage from "./pages/admin/Users";
import PartnersAdmin from "./pages/admin/PartnersAdmin";
import DonorsAdmin from "./pages/admin/DonorsAdmin";
import TestimonialsAdmin from "./pages/admin/TestimonialsAdmin";
import SubscribersAdmin from "./pages/admin/SubscribersAdmin";
import ContactMessagesAdmin from "./pages/admin/ContactMessagesAdmin";
import ResourcesAdmin from "./pages/admin/ResourcesAdmin";
import BrochuresAdmin from "./pages/admin/BrochuresAdmin";
import MaintenanceGate from "./components/MaintenanceGate";
import ProgramsAdmin from "./pages/admin/ProgramsAdmin";

function AppContent() {
  const location = useLocation();
  const admin = (element: ReactElement) => (
    <ProtectedRoute>
      {element}
    </ProtectedRoute>
  );

  const isAdmin = location.pathname.startsWith("/admin");

  const content = (
    <>
      {!isAdmin && <Navbar />}

<Routes>

  {/* ---------- PUBLIC ---------- */}

  <Route path="/" element={<Home />} />

  <Route path="/about" element={<About />} />
  <Route path="/team" element={<Team />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/resources" element={<Resources />} />
  <Route path="/partners" element={<Partners />} />
  <Route path="/donors" element={<Donors />} />
  <Route path="/sponsors" element={<Sponsors />} />

  <Route path="/activities" element={<ActivitiesList />} />
  <Route path="/activities/:id" element={<ActivityDetail />} />
  <Route path="/projects/:id" element={<ProjectDetail />} />

  <Route path="/programs" element={<Programs />} />
  <Route path="/programs/advocacy" element={<Advocacy />} />
  <Route path="/programs/media-literacy" element={<MediaLiteracy />} />
  <Route path="/programs/research" element={<Research />} />
  <Route path="/programs/capacity-building" element={<CapacityBuilding />} />

  <Route path="/knowledge/newsletters" element={<Newsletters />} />
  <Route path="/knowledge/reports" element={<Reports />} />
  <Route path="/knowledge/publications" element={<Publications />} />
  <Route path="/knowledge/press-statements" element={<PressStatements />} />

  <Route path="/mil/about" element={<AboutMIL />} />
  <Route path="/mil/brochure" element={<Brochure />} />
  <Route path="/mil/hubs" element={<AllHubs />} />
  <Route path="/mil/hubs-overview" element={<Hubs />} />
  <Route path="/mil/hub/:slug" element={<HubDetail />} />
  <Route path="/mil/province/:province" element={<ProvinceHubs />} />
  <Route path="/mil/radio-spots" element={<RadioSpots />} />

  <Route path="/projects/sherise" element={<SheRise />} />
  <Route path="/projects/funsani" element={<Funsani />} />
  <Route path="/projects/claim-your-space" element={<ClaimYourSpace />} />
  <Route
    path="/projects/conflict-sensitive-journalism"
    element={<ConflictSensitiveJournalism />}
  />

  {/* ---------- LOGIN ---------- */}

  <Route path="/admin/login" element={<Login />} />
  <Route path="/admin/forgot-password" element={<ForgotPassword />} />
  <Route path="/admin/reset-password" element={<ResetPassword />} />

  {/* ---------- DASHBOARD ---------- */}

  <Route path="/admin" element={admin(<Dashboard />)} />
  <Route path="/admin/homepage" element={admin(<Homepage />)} />

  {/* ---------- ACTIVITIES ---------- */}

  <Route path="/admin/activities" element={admin(<Activities />)} />
  <Route path="/admin/activities/create" element={admin(<CreateActivity />)} />
  <Route path="/admin/activities/:id/edit" element={admin(<EditActivity />)} />

  {/* ---------- PROJECTS ---------- */}

  <Route path="/admin/projects" element={admin(<Projects />)} />
  <Route path="/admin/projects/create" element={admin(<CreateProject />)} />
  <Route path="/admin/projects/:id/edit" element={admin(<EditProject />)} />

  {/* ---------- REPORTS ---------- */}

  <Route path="/admin/reports" element={admin(<AdminReports />)} />
  <Route path="/admin/reports/create" element={admin(<CreateReport />)} />
  <Route path="/admin/reports/:id/edit" element={admin(<EditReport />)} />

  {/* ---------- PUBLICATIONS ---------- */}

  <Route path="/admin/publications" element={admin(<PublicationsAdmin />)} />
  <Route path="/admin/publications/create" element={admin(<CreatePublication />)} />
  <Route path="/admin/publications/:id/edit" element={admin(<EditPublication />)} />

  {/* ---------- NEWSLETTERS ---------- */}

  <Route path="/admin/newsletters" element={admin(<NewslettersAdmin />)} />
  <Route path="/admin/newsletters/create" element={admin(<CreateNewsletter />)} />
  <Route path="/admin/newsletters/:id/edit" element={admin(<EditNewsletter />)} />

  {/* ---------- PRESS STATEMENTS ---------- */}

  <Route path="/admin/press-statements" element={admin(<PressStatementsAdmin />)} />
  <Route path="/admin/press-statements/create" element={admin(<CreatePressStatement />)} />
  <Route path="/admin/press-statements/:id/edit" element={admin(<EditPressStatement />)} />

  {/* ---------- RADIO ---------- */}

  <Route path="/admin/radio-spots" element={admin(<RadioSpotsAdmin />)} />
  <Route path="/admin/radio-spots/create" element={admin(<CreateRadioSpot />)} />
  <Route path="/admin/radio-spots/:id/edit" element={admin(<EditRadioSpot />)} />

  {/* ---------- HUBS ---------- */}

  <Route path="/admin/hubs" element={admin(<AdminHubs />)} />
  <Route path="/admin/hub-events" element={admin(<HubEvents />)} />
  <Route path="/admin/hub-photos" element={admin(<HubPhotos />)} />
  <Route path="/admin/hubs/create" element={admin(<CreateHub />)} />
  <Route path="/admin/hubs/:id/edit" element={admin(<EditHub />)} />

  {/* ---------- PROVINCES ---------- */}

  <Route path="/admin/provinces" element={admin(<Provinces />)} />

  {/* ---------- TEAM ---------- */}

  <Route path="/admin/team" element={admin(<TeamMembers />)} />
  <Route path="/admin/team/create" element={admin(<CreateTeam />)} />
  <Route path="/admin/team/:id/edit" element={admin(<EditTeam />)} />

  {/* ---------- MEDIA ---------- */}

  <Route path="/admin/media" element={admin(<MediaLibrary />)} />
  <Route path="/admin/media/upload" element={admin(<UploadMedia />)} />
  <Route path="/admin/media/:id/edit" element={admin(<EditMedia />)} />

  {/* ---------- SETTINGS ---------- */}

  <Route path="/admin/settings" element={admin(<Settings />)} />

  {/* ---------- USERS ---------- */}

  <Route path="/admin/users" element={admin(<UsersPage />)} />

  {/* ---------- PARTNERS / DONORS / RESOURCES / BROCHURES ---------- */}

  <Route path="/admin/partners" element={admin(<PartnersAdmin />)} />
  <Route path="/admin/donors" element={admin(<DonorsAdmin />)} />
  <Route path="/admin/testimonials" element={admin(<TestimonialsAdmin />)} />
  <Route path="/admin/subscribers" element={admin(<SubscribersAdmin />)} />
  <Route path="/admin/messages" element={admin(<ContactMessagesAdmin />)} />
  <Route path="/admin/program-pages" element={admin(<ProgramsAdmin />)} />
  <Route path="/admin/resources" element={admin(<ResourcesAdmin />)} />
  <Route path="/admin/brochures" element={admin(<BrochuresAdmin />)} />

  {/* ---------- 404 ---------- */}

  <Route path="*" element={<Navigate to="/" replace />} />

</Routes>
      {!isAdmin && <Footer />}
    </>
  );

  if (isAdmin) return content;

  return <MaintenanceGate>{content}</MaintenanceGate>;
}


export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
      <ScrollToTop />
    </BrowserRouter>
  );
}
