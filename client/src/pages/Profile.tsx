import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
    const { user, loading, plan } = useAuth();
    const onboardingCompleted =
        typeof window !== "undefined" &&
        window.localStorage.getItem("onboardingCompleted") === "true";

    if (!user && !loading) {
        return <Navigate to="/auth/sign-in" replace />;
    }

    if (!onboardingCompleted) {
        return <Navigate to="/onboarding" replace />;
    }

    return <>Profile</>;
}