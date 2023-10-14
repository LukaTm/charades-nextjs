import React, { useState } from "react";
import { signIn } from "next-auth/react";

import Link from "next/link";
import "./LoginAndSignup.css";

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
    language,
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
            <h1 className="login-title">
                {language === "English"
                    ? "Login"
                    : language === "Russian"
                    ? "Вход"
                    : "Ieiet"}
            </h1>
            <form onSubmit={handleLogin} className="login-form">
                <input
                    type="email"
                    placeholder={
                        language === "English"
                            ? "Email"
                            : language === "Russian"
                            ? "Электронная почта"
                            : "E-pasts"
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="login-input"
                />
                <input
                    type="password"
                    placeholder={
                        language === "English"
                            ? "Password"
                            : language === "Russian"
                            ? "Пароль"
                            : "Parole"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="login-input"
                />
                <button type="submit" className="login-button">
                    {language === "English"
                        ? "Log In"
                        : language === "Russian"
                        ? "Войти"
                        : "Ieiet"}
                </button>
            </form>
            <p className="login-signup">
                {signupModalHelper ? (
                    <span>
                        {language === "English"
                            ? "Don't have an account?"
                            : language === "Russian"
                            ? "Нет аккаунта?"
                            : "Nav konta?"}
                        <span
                            className="signup-link custom-link"
                            onClick={Signup}
                        >
                            {language === "English"
                                ? "Sign up"
                                : language === "Russian"
                                ? "Зарегистрироваться"
                                : "Reģistrēties"}
                        </span>
                    </span>
                ) : (
                    <span>
                        {language === "English"
                            ? "Don't have an account?"
                            : language === "Russian"
                            ? "Нет аккаунта?"
                            : "Nav konta?"}
                        <Link href="/signup" className="signup-link">
                            {language === "English"
                                ? "Sign up"
                                : language === "Russian"
                                ? "Зарегистрироваться"
                                : "Reģistrēties"}
                        </Link>
                    </span>
                )}
            </p>
            <button
                className="continue-without-login-button"
                onClick={handleContinueWithoutLogin}
            >
                {language === "English"
                    ? "Continue Without Login"
                    : language === "Russian"
                    ? "Продолжить без входа"
                    : "Turpināt bez ienākšanas"}
            </button>
        </div>
    );
}

export default LoginPage;
