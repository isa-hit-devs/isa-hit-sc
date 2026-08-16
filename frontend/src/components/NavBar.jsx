import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const location = useLocation();

    const links = [
        { name: "Home", path: "/" },
        { name: "Events", path: "/events" },
        { name: "Members", path: "/members" },
    ];

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Always show navbar at top of page
            if (currentScrollY < 10) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 60) {
                // Hide when scrolling down
                setIsVisible(false);
            } else if (currentScrollY < lastScrollY) {
                // Show when scrolling up
                setIsVisible(true);
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 w-full border-b border-blue-100 bg-white/80 backdrop-blur-md transition-transform duration-300 ease-in-out ${
                isVisible || open ? "translate-y-0" : "-translate-y-full"
            }`}
        >
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-12 md:h-20 md:px-16 lg:h-24 lg:px-24">
                {/* Logo */}
                <Link
                    to="/"
                    className="bg-gradient-to-b from-blue-900 to-blue-600 bg-clip-text text-2xl font-extrabold text-transparent md:text-3xl lg:text-4xl"
                >
                    ISA
                </Link>

                {/* Desktop links */}
                <div className="hidden items-center gap-8 md:flex md:gap-10 lg:gap-12">
                    {links.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-sm font-semibold transition md:text-base lg:text-lg ${
                                    isActive
                                        ? "text-blue-600 font-bold"
                                        : "text-slate-700 hover:text-blue-600"
                                }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Login button - desktop */}
                <Link
                    to="/login"
                    className="hidden rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 md:block md:px-6 md:py-2.5 md:text-base lg:px-7 lg:py-3 lg:text-lg"
                >
                    Login
                </Link>

                {/* Mobile menu toggle */}
                <button
                    onClick={() => setOpen(!open)}
                    className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
                    aria-label="Toggle menu"
                >
                    <span className={`h-0.5 w-6 bg-slate-800 transition ${open ? "translate-y-2 rotate-45" : ""}`} />
                    <span className={`h-0.5 w-6 bg-slate-800 transition ${open ? "opacity-0" : ""}`} />
                    <span className={`h-0.5 w-6 bg-slate-800 transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="flex flex-col gap-1 border-t border-blue-100 bg-white px-6 py-4 md:hidden">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setOpen(false)}
                            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        to="/login"
                        onClick={() => setOpen(false)}
                        className="mt-2 rounded-full bg-blue-600 px-5 py-2 text-center text-sm font-bold text-white"
                    >
                        Login
                    </Link>
                </div>
            )}
        </nav>
    );
}
