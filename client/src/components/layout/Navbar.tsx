import React, { useState } from "react";
import { Dumbbell, Menu, X, Home, Calendar, TrendingUp, ClipboardList, Settings, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { UserButton } from "@neondatabase/neon-js/auth/react/ui";
import clsx from "clsx";

const NAV_LINKS = [
    { to: "/home", label: "Home", icon: Home },
    { to: "/schedule", label: "Schedule", icon: Calendar },
    { to: "/progress", label: "Progress", icon: TrendingUp },
    { to: "/plans", label: "Plans", icon: ClipboardList },
    { to: "/profile", label: "Profile", icon: User },
    { to: "/settings", label: "Settings", icon: Settings },
];

export default function Navbar() {
    const { user } = useAuth();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (to: string) => location.pathname === to;

    return (
        <>
            <header className="sticky top-0 z-50">
                <nav className="glass border-b border-white/10">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

                        {/* Logo */}
                        <Link to={user ? "/home" : "/"} className="flex items-center gap-3 cursor-pointer">
                            <div className="red-gradient flex h-10 w-10 items-center justify-center rounded-xl shadow-lg shadow-red-500/30">
                                <Dumbbell className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold tracking-tight">FormaAI</h1>
                                <p className="text-xs text-gray-400">Fitness Intelligence</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        {user && (
                            <div className="hidden md:flex items-center gap-1">
                                {NAV_LINKS.map(({ to, label }) => (
                                    <Link
                                        key={to}
                                        to={to}
                                        className={clsx(
                                            "nav-link",
                                            isActive(to) && "nav-active"
                                        )}
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Right side */}
                        <div className="flex items-center gap-3">
                            {user ? (
                                <>
                                    <UserButton />
                                    {/* Mobile menu toggle */}
                                    <button
                                        onClick={() => setMobileOpen(!mobileOpen)}
                                        className="md:hidden w-9 h-9 rounded-lg glass flex items-center justify-center text-muted hover:text-white transition-all"
                                        aria-label="Toggle menu"
                                    >
                                        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                                    </button>
                                </>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link to="/auth/sign-in">
                                        <Button variant="outline">Sign in</Button>
                                    </Link>
                                    <Link to="/auth/sign-up">
                                        <Button>Sign up</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Mobile dropdown */}
                {mobileOpen && user && (
                    <div className="md:hidden glass border-b border-white/10">
                        <div className="px-4 py-3 space-y-1">
                            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    onClick={() => setMobileOpen(false)}
                                    className={clsx(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                        isActive(to)
                                            ? "bg-red-500/15 text-white border border-red-500/20"
                                            : "text-muted hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <Icon size={17} />
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </header>

            {/* Bottom nav for mobile */}
            {user && (
                <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-white/10">
                    <div className="flex items-center justify-around px-2 h-16">
                        {NAV_LINKS.slice(0, 5).map(({ to, label, icon: Icon }) => (
                            <Link
                                key={to}
                                to={to}
                                className={clsx(
                                    "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all",
                                    isActive(to) ? "text-red-400" : "text-muted hover:text-white"
                                )}
                            >
                                <Icon size={20} className={isActive(to) ? "text-red-400" : undefined} />
                                <span className="text-[10px] font-medium">{label}</span>
                            </Link>
                        ))}
                    </div>
                </nav>
            )}
        </>
    );
}