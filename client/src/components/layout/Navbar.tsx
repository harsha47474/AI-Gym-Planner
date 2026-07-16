import React from "react";
import { Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { UserButton } from "@neondatabase/neon-js/auth/react/ui";

export default function Navbar() {
    const { user } = useAuth();
    console.log("Navbar user:", user);

    return (
        <header className="sticky top-0 z-50">
            <nav className="glass border-b border-white/10">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer">
                        <div className="red-gradient flex h-10 w-10 items-center justify-center rounded-xl shadow-lg shadow-red-500/30">
                            <Dumbbell className="h-5 w-5 text-white" />
                        </div>

                        <div>
                            <h1 className="text-lg font-bold tracking-tight">FormaAI</h1>
                            <p className="text-xs text-gray-400">Fitness Intelligence</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        <Link to="/" className="nav-link nav-active">
                            Dashboard
                        </Link>

                        <Link to="/workouts" className="nav-link">
                            Workouts
                        </Link>

                        <Link to="/progress" className="nav-link">
                            Progress
                        </Link >

                        <Link to="/nutrition" className="nav-link">
                            Nutrition
                        </Link>

                        <Link to="/profile" className="nav-link">
                            Profile
                        </Link>


                    </div>

                    {user ? (
                        <>
                            <div className="flex items-center gap-3">
                                <Link to="/profile">
                                    <Button variant="outline">
                                        My Plan
                                    </Button>
                                </Link>
                                <UserButton />
                            </div>
                        </>
                    ) : (<>
                        <div className="flex items-center gap-3">
                            <Link to="/auth/sign-in">
                                <Button variant="outline">
                                    Sign in
                                </Button>
                            </Link>
                            <Link to="/auth/sign-up">
                                <Button>
                                    Sign up
                                </Button>
                            </Link>
                        </div>
                    </>)}

                    {/* Right Side */}

                </div>
            </nav>
        </header>
    );
}