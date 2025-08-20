import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EyeOff, Eye } from "lucide-react";
import { login, register } from "../http/index.js";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

// Dark palette requested
const BG_PRIMARY = "#22262B";
const BG_SECONDARY = "#37383B";

function clsx() {
    return Array.from(arguments).filter(Boolean).join(" ");
}

const inputBase =
    "w-full rounded-2xl px-3 text-sm py-2  text-gray-100 placeholder-gray-400 outline-none border focus:border-white/60 transition";

const fieldWrap = "flex flex-col gap-2";

function EmailField({ value, onChange, error }) {
    return (
        <div className={fieldWrap}>
            <label className="text-sm text-gray-300" htmlFor="email">
                Email
            </label>
            <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={clsx(
                    inputBase,
                    error ? "border-red-500/70" : "border-white/10"
                )}
                placeholder="you@example.com"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {error && <span className="text-xs text-red-400">{error}</span>}
        </div>
    );
}

function PasswordField({
    value,
    onChange,
    error,
    id = "password",
    label = "Password",
}) {
    const [show, setShow] = useState(false);
    return (
        <div className={fieldWrap}>
            <label className="text-sm text-gray-300" htmlFor={id}>
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    name={id}
                    type={show ? "text" : "password"}
                    autoComplete={
                        id === "password" ? "current-password" : "new-password"
                    }
                    className={clsx(
                        inputBase,
                        error ? "border-red-500/70" : "border-white/10",
                        "pr-12"
                    )}
                    placeholder={label}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute inset-y-0 right-2 my-auto h-5 cursor-pointer hover:scale-110 rounded-xl px-3 text-xs text-gray-200 "
                    aria-label={show ? "Hide password" : "Show password"}
                >
                    {show ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
            </div>
            {error && <span className="text-xs text-red-400">{error}</span>}
        </div>
    );
}

export default function AuthPage() {
    const [mode, setMode] = useState("login");
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [name, setName] = useState("");
    const [confirm, setConfirm] = useState("");
    const [agree, setAgree] = useState(false);

    const [errors, setErrors] = useState({});

    const { loginUser } = useAuth();

    const navigate = useNavigate();

    function validate() {
        const next = {};
        if (!email.trim()) next.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            next.email = "Enter a valid email";

        if (!password) next.password = "Password is required";
        else if (password.length < 8) next.password = "Minimum 8 characters";

        if (mode === "signup") {
            if (!name.trim()) next.name = "Full name is required";
            if (!confirm) next.confirm = "Please confirm password";
            else if (confirm !== password)
                next.confirm = "Passwords do not match";
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            let res;
            if (mode === "login") {
                res = await login({ email, password });
                console.log(res.data)
                if (res.status === 200) {
                    loginUser(res.data.loggedInUser);
                    toast.success("Login successful");
                }
                navigate("/");
            } else {
                res = await register({ name, email, password });

                toast.success("Signup successful,Now you can Login");
                setMode("login");
            }
        } catch (error) {
            console.log(error.response.data);
            toast.error(error.response.data.error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full bg-[#212121] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="w-full max-w-md"
            >
                <div className="backdrop-blur-sm bg-[white/5] border border-white/10 rounded-3xl shadow-2xl p-6 sm:px-5">
                    <div className="flex items-center justify-between gap-2  mb-6">
                        <div>
                            <h1 className="text-2xl sm:text-2xl font-semibold text-white">
                                {mode === "login"
                                    ? "Welcome back"
                                    : "Create account"}
                            </h1>
                            <p className="text-gray-300/80 text-sm mt-1">
                                {mode === "login"
                                    ? "Log in with your email and password"
                                    : "Sign up to get started"}
                            </p>
                        </div>
                        <div className="flex rounded-2xl overflow-hidden border border-white/10">
                            <button
                                onClick={() => setMode("login")}
                                className={clsx(
                                    "px-3 py-2 text-sm",
                                    mode === "login"
                                        ? "bg-white/15 text-white"
                                        : "text-gray-300 hover:bg-white/10"
                                )}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setMode("signup")}
                                className={clsx(
                                    "px-3 py-2 text-sm",
                                    mode === "signup"
                                        ? "bg-white/15 text-white"
                                        : "text-gray-300 hover:bg-white/10"
                                )}
                            >
                                Sign up
                            </button>
                        </div>
                    </div>

                    <form
                        className="grid gap-4"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <AnimatePresence mode="wait">
                            {mode === "signup" && (
                                <motion.div
                                    key="name"
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.2 }}
                                    className={fieldWrap}
                                >
                                    <label
                                        className="text-sm text-gray-300"
                                        htmlFor="name"
                                    >
                                        Full name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        className={clsx(
                                            inputBase,
                                            errors.name
                                                ? "border-red-500/70"
                                                : "border-white/10"
                                        )}
                                        placeholder="Jane Doe"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                    {errors.name && (
                                        <span className="text-xs text-red-400">
                                            {errors.name}
                                        </span>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <EmailField
                            value={email}
                            onChange={setEmail}
                            error={errors.email}
                        />
                        <PasswordField
                            value={password}
                            onChange={setPassword}
                            error={errors.password}
                        />

                        <AnimatePresence mode="wait">
                            {mode === "signup" && (
                                <motion.div
                                    key="confirm"
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <PasswordField
                                        id="confirm"
                                        label="Confirm password"
                                        value={confirm}
                                        onChange={setConfirm}
                                        error={errors.confirm}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={handleSubmit}
                            type="submit"
                            disabled={loading}
                            className={clsx(
                                "mt-2 w-full rounded-2xl px-2 cursor-pointer py-1 font-medium text-white",
                                "bg-white/15 hover:bg-white/20 active:bg-white/25 border border-white/10",
                                loading && "opacity-60 cursor-not-allowed"
                            )}
                        >
                            {loading
                                ? mode === "login"
                                    ? "Logging in…"
                                    : "Creating account…"
                                : mode === "login"
                                ? "Log in"
                                : "Create account"}
                        </button>
                    </form>
                </div>

                <div className="mt-6 text-center">
                    <button
                        onClick={() =>
                            setMode(mode === "login" ? "signup" : "login")
                        }
                        className="text-gray-300 hover:text-white underline-offset-4 hover:underline"
                    >
                        {mode === "login"
                            ? "No account? Sign up"
                            : "Have an account? Log in"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
