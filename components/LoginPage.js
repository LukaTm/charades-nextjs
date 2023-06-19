import React, { useContext, useState } from "react";
import { signIn } from "next-auth/react";

import Link from "next/link";
import axios from "axios";
import "./LoginPage.css";

// TITLE and DESCROPTION

function LoginPage({
    logInWithoutAccount,
    handleLoginFalse,
    rerun,
    signupModalHelper,
    setSignupModalHelper,
    setSignupModal,
    setLoginModal,
    setRemoveGuestUser,
    loginModal,
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const currentURL = window.location.href;

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });
            if (response.status === 200) {
                handleLoginFalse?.();
                localStorage.removeItem("guestAccount");
                rerun();
                setRemoveGuestUser(true);
            }
        } catch (error) {
            // Handle error
            console.log(error);
        }
    };

    const handleContinueWithoutLogin = () => {
        logInWithoutAccount();
        handleLoginFalse?.();
    };

    const Signup = () => {
        setLoginModal(false);
        setSignupModal(true);
    };

    return (
        <div className="login-container z-50">
            <div
                className={
                    currentURL === "http://localhost:3000/login"
                        ? ""
                        : "close-button"
                }
                onClick={handleLoginFalse}
            ></div>
            <h1 className="login-title">Login</h1>
            <form onSubmit={handleLogin} className="login-form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="login-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="login-input"
                />
                <button type="submit" className="login-button">
                    Log In
                </button>
            </form>
            <p className="login-signup">
                {signupModalHelper ? (
                    <span>
                        Don't have an account?
                        <span
                            className="signup-link custom-link"
                            onClick={Signup}
                        >
                            Sign up
                        </span>
                    </span>
                ) : (
                    <span>
                        Don't have an account?
                        <Link href="/signup" className="signup-link">
                            Sign up
                        </Link>
                    </span>
                )}
            </p>
            <button
                className="continue-without-login-button"
                onClick={handleContinueWithoutLogin}
            >
                Continue Without Login
            </button>
        </div>
    );
}

export default LoginPage;
