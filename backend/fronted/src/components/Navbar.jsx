import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { logout } from "../http/index.js";
import toast from "react-hot-toast";

const Navbar = ({}) => {
    const [open, setOpen] = useState(false);
    const { user } = useAuth();

    const logoutHandler = async () => {
        try {
            await logout();
            toast.success("Logout successful");
            window.location.reload();
        } catch (error) {
            toast.error("Login failed");
        }
    };

    return (
        <header className="w-full text-white  px-7 py-3 flex items-center justify-between">
            {/* Left side - App Name */}
            <h1 className="text-xl font-bold">Chai Note LM</h1>

            {/* Right side - Profile */}
            <div className="relative">
                {/* Avatar */}
                <button
                    onClick={() => setOpen(!open)}
                    className="w-10 h-10 rounded-full cursor-pointer bg-green-500 border-2 border-white/60  text-white flex items-center justify-center font-semibold uppercase"
                >
                    {user?.name?.[0] || "U"}
                </button>

                {/* Dropdown */}
                {open && (
                    <div className="absolute right-0 mt-2 w-48 border-black bg-[#212121] rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.8)] border px-5 py-7 z-50">
                        <p className="font-semibold text-gray-300">
                            {user?.name}
                        </p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        <button
                            onClick={logoutHandler}
                            className="mt-7 w-full cursor-pointer bg-red-500 text-white py-1 rounded-md hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
