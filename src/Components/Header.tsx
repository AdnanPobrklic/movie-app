import React, {
    Dispatch,
    SetStateAction,
    useState,
    useEffect,
    useRef,
} from "react";
import classes from "../styles/Header.module.css";
import { gsap } from "gsap";

interface HeaderProps {
    setShowTV: Dispatch<SetStateAction<boolean>>;
    setSearchValue: Dispatch<SetStateAction<string>>;
    showTV: boolean;
    searchValue: string;
}

export default function Header({
    setShowTV,
    showTV,
    setSearchValue,
    searchValue,
}: HeaderProps) {
    const [inputFocused, setInputFocused] = useState(false);

    useEffect(() => {
        if (searchValue.length > 0) {
            setInputFocused(true);
        } else {
            setInputFocused(false);
        }
    }, [searchValue]);

    useEffect(() => {
        localStorage.setItem("showTV", showTV.toString());
    }, [showTV]);

    const headerRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            headerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.5, delay: 0.3 }
        );
    }, []);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    return (
        <header className={`${classes.header}`} ref={headerRef}>
            <nav className={`${classes.navbar}`}>
                <ul>
                    <li
                        onClick={() => setShowTV(false)}
                        className={!showTV ? classes.active : ""}
                    >
                        Movies
                    </li>
                    <li
                        onClick={() => setShowTV(true)}
                        className={showTV ? classes.active : ""}
                    >
                        TV Shows
                    </li>
                </ul>
            </nav>
            <div className={`${classes.searchContainer}`}>
                <i
                    className={`fa-solid fa-magnifying-glass ${
                        inputFocused ? classes.inactive : ""
                    }`}
                ></i>
                <input
                    type="text"
                    placeholder="Search..."
                    onChange={handleSearchChange}
                    className={`${inputFocused ? classes.active : ""}`}
                    value={searchValue}
                />
            </div>
        </header>
    );
}
