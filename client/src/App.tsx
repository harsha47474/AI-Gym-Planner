import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";

// Layout with Navbar
function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

// Layout without Navbar
function AuthLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes that use the main layout with Navbar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Routes that use the auth layout without Navbar */}
        <Route element={<AuthLayout />}>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/auth/:pathname" element={<Auth />} />
          <Route path="/account/:pathname" element={<div>Account</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
