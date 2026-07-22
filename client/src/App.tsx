import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Schedule from "./pages/Schedule";
import WorkoutPage from "./pages/WorkoutPage";
import Progress from "./pages/Progress";
import Plans from "./pages/Plans";
import Settings from "./pages/Settings";

// Layout with Navbar
function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen pb-16 md:pb-0">
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
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/schedule" element={<Schedule />} />
                    <Route path="/workout/:day" element={<WorkoutPage />} />
                    <Route path="/progress" element={<Progress />} />
                    <Route path="/plans" element={<Plans />} />
                    <Route path="/settings" element={<Settings />} />
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
