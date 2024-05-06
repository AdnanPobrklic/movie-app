import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Header from "../Components/Header";
import MovieCard from "../Components/MovieCard";
import classes from "../styles/Home.module.css";
import BeatLoader from "react-spinners/BeatLoader";
import { useMovies } from "../Components/MovieProvider";
import gsap from "gsap";

const Home: React.FC = () => {
    interface Item {
        id: number;
        poster_path: string;
        name: string;
        vote_average: number;
        [key: string]: any;
    }

    const [isAPILoading, setIsAPILoading] = useState<boolean>(true);
    const { setCurrentDisplay } = useMovies();
    const {
        currentDisplay,
        showTV,
        setShowTV,
        searchValue,
        setSearchValue,
        debouncedSearchValue,
    } = useMovies();
    useState<string>("");
    const [noResults, setNoResults] = useState(false);

    useEffect(() => {
        if (debouncedSearchValue.length < 3) {
            setIsAPILoading(true);
            const url = `https://api.themoviedb.org/3/${
                showTV ? "tv" : "movie"
            }/popular?language=en-US&page=1`;
            const options = {
                headers: {
                    accept: "application/json",
                    Authorization:
                        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MThlZTQ2YWUyNmZjZDMwZmZhOGYxN2I1ZjAzZWUxMCIsInN1YiI6IjY2MzY4MTM5ODNlZTY3MDEyNDQxNmYzNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mliKGz8C8ApZk3PQ2PSdXVMl8bET-v8qK--vCmIiBvc",
                },
            };

            axios
                .get(url, options)
                .then((res) => {
                    setNoResults(res.data.results.length < 1 ? true : false);
                    const top10 = res.data.results.slice(0, 10);
                    setIsAPILoading(false);
                    setCurrentDisplay(
                        top10.map((item: Item) => ({
                            ...item,
                            vote_average: parseFloat(
                                item.vote_average.toFixed(2)
                            ),
                        }))
                    );
                })
                .catch((err) => console.error("error:" + err));
        } else {
            setIsAPILoading(true);
            const options = {
                headers: {
                    accept: "application/json",
                    Authorization:
                        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MThlZTQ2YWUyNmZjZDMwZmZhOGYxN2I1ZjAzZWUxMCIsInN1YiI6IjY2MzY4MTM5ODNlZTY3MDEyNDQxNmYzNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mliKGz8C8ApZk3PQ2PSdXVMl8bET-v8qK--vCmIiBvc",
                },
            };

            axios
                .get(
                    `https://api.themoviedb.org/3/search/${
                        showTV ? "tv" : "movie"
                    }?query=${debouncedSearchValue}&include_adult=false&language=en-US&page=1`,
                    options
                )
                .then((res) => {
                    setNoResults(res.data.results.length < 1 ? true : false);
                    const top10 = res.data.results.slice(0, 10);
                    setIsAPILoading(false);
                    setCurrentDisplay(
                        top10.map((item: Item) => ({
                            ...item,
                            vote_average: parseFloat(
                                item.vote_average.toFixed(2)
                            ),
                        }))
                    );
                })
                .catch((err) => console.error(err));
        }
    }, [showTV, debouncedSearchValue]);

    const headingRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            headingRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.5, delay: 0.3 }
        );
    }, []);

    return (
        <>
            <Header
                setShowTV={setShowTV}
                showTV={showTV}
                setSearchValue={setSearchValue}
                searchValue={searchValue}
            />
            <main>
                <h1 className="heading" ref={headingRef}>
                    Popular {showTV ? "TV Shows" : "Movies"}
                </h1>
                <section className={`${classes.cardContainer}`}>
                    {isAPILoading ? (
                        <div className="loader-holder">
                            <BeatLoader color="#56B4E9" size={15} />
                        </div>
                    ) : (
                        currentDisplay.map((item, index) => (
                            <MovieCard
                                key={item.id}
                                num={index + 1}
                                src={item.poster_path}
                                title={showTV ? item.name : item.title}
                                rating={item.vote_average}
                                id={item.id}
                                showTV={showTV}
                            />
                        ))
                    )}
                    {noResults && !isAPILoading && (
                        <p className={classes.noResults}>
                            No results for "{searchValue}"
                        </p>
                    )}
                </section>
            </main>
        </>
    );
};

export default Home;
