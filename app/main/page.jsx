"use client";

import "./MainPage.css";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";

import LoginPage from "../../components/LoginPage";
import SignUpPage from "../../components/SignUpPage";
import AuthContext from "../../store/context";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";
import { useSession } from "next-auth/react";

import { useCookies } from "react-cookie";

export default function Home() {
    // CONTEXT
    const { rerun, SetTheRerun, defaultLangRef, defaultLang, lang, setLang } =
        useContext(AuthContext);

    // Routing AND Params
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingCustomWord, setloadingCustomWord] = useState(false);
    const [successCutsomWordMessage, setSuccessCutsomWordMessage] =
        useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [removeGuestUser, setRemoveGuestUser] = useState(false);
    const [emptyWordMessage, setEmptyWordMessage] = useState(false);
    const [guestAccount, setGuestAccount] = useState(true);
    const [statusHelper, setStatusHelper] = useState(true);
    const [userStatus, setUserStatus] = useState("");
    const [cookies] = useCookies(["token"]);
    const currentURL = window.location.href;

    const [numWords, setNumWords] = useState(1);
    const [category, setCategory] = useState("Easy");
    const [language, setLanguage] = useState("English");
    const [customWord, setCustomWord] = useState("");
    const [errorMessage, setErrorMessage] = useState(false);
    const [numberOfWords, setNumberOfWords] = useState(0);

    const [words, setWords] = useState([]);
    const [loginModal, setLoginModal] = useState(false);
    const [signupModalHelper, setSignupModalHelper] = useState(true);
    const [signupModal, setSignupModal] = useState(false);
    const [loginModalHelper, setLoginModalHelper] = useState(true);
    const [customWordExistsError, setcustomWordExistsError] = useState(false);

    const [isHolding, setIsHolding] = useState(false);
    const [operation, setOperation] = useState(null);

    const isFirstClick = useRef(true); // Ref to track the first click

    const [onlyUseCustomWordsValue, setOnlyUseCustomWordsValue] = useState("");
    const [onlyUseCustomWords, setOnlyUseCustomWords] = useState(false);

    //  USER SESSION
    const { data: session, status } = useSession();

    useEffect(() => {
        if (isLoaded) {
            if (status === "authenticated") {
                localStorage.removeItem("guestAccount");
                setGuestAccount(false);
            } else {
                setIsLoaded(true);
                localStorage.setItem("guestAccount", JSON.stringify(true));
            }
        }
        // pathname INSTEAD of FULL URL
        if (window.location.pathname === "/main") {
            // Only navigate to /main with query params on first run
            router.push(`/main?lang=${defaultLang}`);
        }
    }, [isLoaded, defaultLang, status, session]);

    useEffect(() => {
        if (status !== "loading") {
            setIsLoaded(true);
        }
    }, [status, session]);

    useEffect(() => {
        if (removeGuestUser) {
            localStorage.removeItem("guestAccount");
            // setGuestAccount(false);
            setStatusHelper(false);
        }
        if (guestAccount && statusHelper) {
            router.push(`/main?lang=${defaultLang}`);
        } else {
            setIsAuthenticated(true);
            // Function to check authentication status with the server
            if (status === "authenticated") {
                setIsAuthenticated(true);
                localStorage.removeItem("guestAccount");
            } else {
                setIsAuthenticated(false);
            }
        }
    }, [
        guestAccount,
        defaultLang,
        currentURL,
        rerun,
        removeGuestUser,
        statusHelper,
    ]);

    const handleOptionChange = (event) => {
        const selectedValue = event.target.value;
        const newValue = selectedValue === "option1" ? false : true;
        setOnlyUseCustomWords(newValue);
        setOnlyUseCustomWordsValue(event.target.value);
    };
    const logInWithoutAccount = () => {
        setGuestAccount(true);
        localStorage.setItem("guestAccount", JSON.stringify(true));
        router.push(`/main?lang=${defaultLang}`);
    };

    useEffect(() => {
        const params = new URLSearchParams();

        if (language === "English") {
            params.set("lang", "eng");
        } else if (language === "Russian") {
            params.set("lang", "rus");
        } else if (language === "Latvian") {
            params.set("lang", "lv");
        } else {
            params.set("lang", "eng");
        }

        window.history.replaceState({}, "", `?${params.toString()}`);
    }, [language]);

    // lang about the current URL params
    // const { lang } = router.query;
    useEffect(() => {
        const search = searchParams.get("lang");
        setLang(search);
    }, []);

    useEffect(() => {
        switch (lang) {
            case "eng":
                setLanguage("English");
                break;
            case "rus":
                setLanguage("Russian");
                break;
            case "lv":
                setLanguage("Latvian");
                break;
            default:
                setLanguage("English");
        }
    }, [lang]);

    useEffect(() => {
        setNumberOfWords(words.length);
    }, [words]);

    useEffect(() => {
        // MULTIBLE POSSIBLE VALUES
        let timeoutId;
        let intervalId;
        const updatedNumWordsPlus = numWords + 1;
        const updatedNumWordsMinus = numWords - 1;

        if (isHolding) {
            if (isFirstClick.current) {
                timeoutId = setTimeout(() => {
                    intervalId = setInterval(() => {
                        setNumWords((prevCount) => {
                            if (
                                operation === "+" &&
                                updatedNumWordsPlus <= 50
                            ) {
                                return prevCount + 1;
                            } else if (
                                operation === "-" &&
                                updatedNumWordsMinus >= 1
                            ) {
                                return prevCount - 1;
                            } else {
                                return numWords;
                            }
                        });
                    }, 20);
                }, 500);

                isFirstClick.current = false; // Update the flag after the first click
            } else {
                intervalId = setInterval(() => {
                    setNumWords((prevCount) => {
                        if (operation === "+" && updatedNumWordsPlus <= 50) {
                            return prevCount + 1;
                        } else if (
                            operation === "-" &&
                            updatedNumWordsMinus >= 1
                        ) {
                            return prevCount - 1;
                        } else {
                            return numWords;
                        }
                    });
                }, 50);
            }
        } else {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
            isFirstClick.current = true; // Reset the flag when not holding
        }

        return () => {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        };
    }, [isHolding, operation, numWords]);

    const handleMouseDown = (operation) => {
        setIsHolding(true);
        setOperation(operation);
    };

    const handleMouseUp = () => {
        setIsHolding(false);
    };

    const handleNumWordsChange = (increment) => {
        const updatedNumWords = numWords + increment;
        if (updatedNumWords >= 1 && updatedNumWords <= 50) {
            setNumWords(updatedNumWords);
        }
    };

    const handleNumWordsSingleClick = (increment) => {
        handleNumWordsChange(increment);
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

    const handleInputCustomWordChange = (event) => {
        setSuccessCutsomWordMessage(false);
        setCustomWord(event.target.value);
        setcustomWordExistsError(false);
        setErrorMessage(false);
        setEmptyWordMessage(false);
    };

    const handleGenerateClick = async () => {
        setEmptyWordMessage(false);
        setSuccessCutsomWordMessage(false);
        setErrorMessage(false);
        if (onlyUseCustomWords) {
            try {
                setWords([]);
                setIsLoading(true);
                const response = await axios.post(`/api/get-custom-word`, {
                    numWords: numWords,
                });
                if (response.data === undefined) {
                    setWords(["No words found"]);
                } else {
                    setWords(response.data.randomArray);
                }
            } catch (error) {
                if (!error.response.data.notAuth) {
                    setLoginModal(true);
                } else {
                    console.log(error);
                }
            } finally {
                setIsLoading(false);
            }
        } else {
            try {
                setWords([]);
                setIsLoading(true);
                const response = await axios.post("/api/getwords", {
                    category: category,
                    numWords: numWords,
                    language: language,
                });

                setWords(response.data.charadesWords);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleCustomWord = async (event) => {
        setEmptyWordMessage(false);
        setSuccessCutsomWordMessage(false);
        setErrorMessage(false);
        setcustomWordExistsError(false);
        event.preventDefault();
        if (customWord.trim() === "") {
            setEmptyWordMessage(true);
            return;
        }
        try {
            setloadingCustomWord(true);
            const response = await axios.post(`/api/create-custom-word`, {
                customWord: customWord,
            });
            if (response.status === 201) {
                setCustomWord("");
                setErrorMessage(false);
                setSuccessCutsomWordMessage(true);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setLoginModal(true);
            } else if (error.response && error.response.status === 400) {
                setErrorMessage(true);
                setcustomWordExistsError(true);
            } else {
                setErrorMessage(false);
                setLoginModal(true);
            }
        } finally {
            setloadingCustomWord(false);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await signOut({ redirect: false });

            setIsAuthenticated(false);
            localStorage.setItem("guestAccount", JSON.stringify(true));
            rerun();
        } catch (error) {
            console.log(error);
        } finally {
            setErrorMessage(false);
            setcustomWordExistsError(false);
            setEmptyWordMessage(false);
        }
    };
    const handleLogin = () => {
        setLoginModal(true);
        setErrorMessage(false);
        setcustomWordExistsError(false);
        setEmptyWordMessage(false);
    };
    const handleLoginFalse = () => {
        setLoginModal(false);
        setRemoveGuestUser(false);
    };

    const handleSignupFalse = () => {
        setSignupModal(false);
    };

    return (
        <>
            <div
                className={signupModal || loginModal ? "dark-background" : ""}
            ></div>
            <div
                className={`main-page ${
                    loginModal ? "modal-background darken" : ""
                }`}
            >
                <header className="header">
                    <div className="h1-container">
                        <h1>
                            {language === "English"
                                ? "Charades"
                                : language === "Russian"
                                ? "Шарады"
                                : language === "Latvian"
                                ? "Mēmais šovs"
                                : "Charades"}
                        </h1>
                    </div>

                    <div className="header-btn-container">
                        {isAuthenticated && isLoaded ? (
                            <button
                                className="logout-btn"
                                onClick={handleLogout}
                            >
                                {language === "English"
                                    ? "Logout"
                                    : language === "Russian"
                                    ? "Выйти"
                                    : language === "Latvian"
                                    ? "Iziet"
                                    : "Logout"}
                            </button>
                        ) : isLoaded ? (
                            <button className="login-btn" onClick={handleLogin}>
                                {language === "English"
                                    ? "Login"
                                    : language === "Russian"
                                    ? "Войти"
                                    : language === "Latvian"
                                    ? "Ieiet"
                                    : "Login"}
                            </button>
                        ) : (
                            ""
                        )}
                    </div>
                </header>
                <div className="custom-word-container ">
                    <form>
                        <label
                            htmlFor="custom-word"
                            className={`custom-word-label`}
                        >
                            {language === "English"
                                ? "Create custom charades word:"
                                : language === "Russian"
                                ? "Создайте собственное слово шарады:"
                                : language === "Latvian"
                                ? "Izveidot savu mēmā šova vārdu:"
                                : "Create custom charades word:"}
                        </label>
                        <div className="custom-word-container-inside">
                            <div className={`custom-word-error-container `}>
                                <input
                                    type="text"
                                    className={`${
                                        customWordExistsError
                                            ? "custom-word-error"
                                            : ""
                                    }`}
                                    id="custom-word"
                                    name="custom-word"
                                    placeholder={
                                        language === "English"
                                            ? "Enter your own word"
                                            : language === "Russian"
                                            ? "Введите свое слово"
                                            : language === "Latvian"
                                            ? "Ievadiet savu vārdu"
                                            : "Enter your own word"
                                    }
                                    value={customWord}
                                    onChange={handleInputCustomWordChange}
                                ></input>
                                <span id="empty-input-field">
                                    {emptyWordMessage
                                        ? language === "English"
                                            ? "Please enter a word"
                                            : language === "Russian"
                                            ? "Пожалуйста, введите слово"
                                            : language === "Latvian"
                                            ? "Lūdzu, ievadiet vārdu"
                                            : ""
                                        : ""}
                                </span>
                                <span id="custom-word-success">
                                    {successCutsomWordMessage
                                        ? language === "English"
                                            ? "Successfully created a word!"
                                            : language === "Russian"
                                            ? "Слово создано!"
                                            : language === "Latvian"
                                            ? "Veiksmīgi tika izveidots vārds!"
                                            : ""
                                        : ""}
                                </span>
                                <span id="loading-custom-word">
                                    {loadingCustomWord
                                        ? language === "English"
                                            ? "Creating custom word..."
                                            : language === "Russian"
                                            ? "Создание пользовательского слова..."
                                            : language === "Latvian"
                                            ? "Tiek izveidots vārds..."
                                            : ""
                                        : ""}
                                </span>
                                <span id="already-exists-error">
                                    {errorMessage
                                        ? language === "English"
                                            ? "Custom word already exists"
                                            : language === "Russian"
                                            ? "Пользовательское слово уже существует"
                                            : language === "Latvian"
                                            ? "Vārds jau eksistē"
                                            : ""
                                        : ""}
                                </span>
                            </div>
                            <input
                                id="custom-word-submit-btn"
                                type="submit"
                                value={
                                    language === "English"
                                        ? "Submit"
                                        : language === "Russian"
                                        ? "Подтвердить"
                                        : language === "Latvian"
                                        ? "Iesniegt"
                                        : "Submit"
                                }
                                onClick={handleCustomWord}
                            ></input>
                        </div>
                    </form>
                </div>
                <div className="controls">
                    <div className="select-drop-down">
                        <select
                            id="language"
                            value={language}
                            onChange={handleLanguageChange}
                        >
                            <option value="English">English</option>
                            <option value="Russian">Russian</option>
                            <option value="Latvian">Latvian</option>
                        </select>
                    </div>
                    <div className="select-drop-down">
                        <div className="flex items-baseline mb-2">
                            <label htmlFor="only-custom-words">
                                {language === "English"
                                    ? "Only use custom words:"
                                    : language === "Russian"
                                    ? "Используйте только собственные слова:"
                                    : language === "Latvian"
                                    ? "Izmantot tikai savus izveidotos vārdus:"
                                    : "Only use custom words:"}
                            </label>
                            <select
                                id="only-custom-words"
                                value={onlyUseCustomWordsValue}
                                onChange={handleOptionChange}
                            >
                                <option value="option1">
                                    {language === "English"
                                        ? "False"
                                        : language === "Russian"
                                        ? "Нет"
                                        : language === "Latvian"
                                        ? "Nē"
                                        : "False"}
                                </option>

                                <option value="option2">
                                    {language === "English"
                                        ? "True"
                                        : language === "Russian"
                                        ? "Да"
                                        : language === "Latvian"
                                        ? "Jā"
                                        : "True"}
                                </option>
                            </select>
                        </div>
                        <div>
                            {!onlyUseCustomWords && (
                                <>
                                    <label htmlFor="category">
                                        {language === "English"
                                            ? "Difficulty:"
                                            : language === "Russian"
                                            ? "Сложность:"
                                            : language === "Latvian"
                                            ? "Grūtība:"
                                            : null}
                                    </label>
                                    <select
                                        id="category"
                                        value={category}
                                        onChange={handleCategoryChange}
                                    >
                                        <option value="Easy">
                                            {language === "English"
                                                ? "Easy"
                                                : language === "Russian"
                                                ? "Легкий"
                                                : language === "Latvian"
                                                ? "Viegla"
                                                : "Easy"}
                                        </option>
                                        <option value="Medium">
                                            {language === "English"
                                                ? "Medium"
                                                : language === "Russian"
                                                ? "Средний"
                                                : language === "Latvian"
                                                ? "Vidēja"
                                                : "Medium"}
                                        </option>
                                        <option value="Hard">
                                            {language === "English"
                                                ? "Hard"
                                                : language === "Russian"
                                                ? "Трудный"
                                                : language === "Latvian"
                                                ? "Grūta"
                                                : "Hard"}
                                        </option>
                                    </select>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="num-submit-outer-container">
                        <div className="num-words">
                            <button
                                onMouseDown={() => handleMouseDown("-")}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                onClick={() => handleNumWordsSingleClick(-1)}
                            >
                                -
                            </button>
                            <div className="num-words-container">
                                <span>{numWords}</span>
                            </div>
                            <button
                                onMouseDown={() => handleMouseDown("+")}
                                onMouseUp={handleMouseUp}
                                onClick={() => handleNumWordsSingleClick(1)}
                                onMouseLeave={handleMouseUp}
                                onContextMenuCapture={(e) => {
                                    e.preventDefault();
                                    return false;
                                }}
                            >
                                +
                            </button>
                        </div>
                        <button
                            className="generate-btn"
                            onClick={handleGenerateClick}
                        >
                            {language === "English"
                                ? "Submit"
                                : language === "Russian"
                                ? "Подтвердить"
                                : language === "Latvian"
                                ? "Iesniegt"
                                : "Submit"}
                        </button>
                    </div>
                </div>
                <div className="word-list">
                    {isLoading && language === "English"
                        ? "Loading words..."
                        : isLoading && language === "Russian"
                        ? "Получение слова..."
                        : isLoading && language === "Latvian"
                        ? "Iegūst vārdus..."
                        : ""}
                    {words.map((word, index) => (
                        <span
                            className={`word-item ${
                                numberOfWords <= 5 && numberOfWords > 2
                                    ? "five-words-size"
                                    : numberOfWords <= 20 && numberOfWords > 5
                                    ? "ten-words-size"
                                    : numberOfWords <= 2
                                    ? "one-words-size"
                                    : ""
                            }`}
                            key={index}
                        >
                            {word}
                        </span>
                    ))}
                </div>
            </div>
            {loginModal && (
                <LoginPage
                    loginModal={loginModal}
                    logInWithoutAccount={logInWithoutAccount}
                    handleLoginFalse={handleLoginFalse}
                    rerun={SetTheRerun}
                    signupModalHelper={signupModalHelper}
                    setSignupModalHelper={setSignupModalHelper}
                    setSignupModal={setSignupModal}
                    setLoginModal={setLoginModal}
                    setRemoveGuestUser={setRemoveGuestUser}
                />
            )}
            {signupModal && (
                <SignUpPage
                    handleSignupFalse={handleSignupFalse}
                    setLoginModal={setLoginModal}
                    setLoginModalHelper={setLoginModalHelper}
                    loginModalHelper={loginModalHelper}
                    setSignupModal={setSignupModal}
                />
            )}
        </>
    );
}
