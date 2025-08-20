import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AuthPage from "./components/AuthPage";
import { useAuth, AuthProvider } from "./context/AuthContext";
import Dashboard from "./components/Dashboard";
import { useLoadingWithRefresh } from "./utils/useLoadingWithRefresh";

function ProtectedRoute({ children }) {
    const { isLoggedIn } = useAuth();
    if (!isLoggedIn) {
        return <Navigate to="/auth" replace />;
    }
    return children;
}

const App = () => {
    useLoadingWithRefresh();
    return (
        <>
            <Routes>
                <Route path="/auth" element={<AuthPage />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster position="top-right" reverseOrder={false} />
        </>
    );
};

export default App;
