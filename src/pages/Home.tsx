import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Header from "../Components/Header";
import MovieCard from "../Components/MovieCard";
import classes from "../styles/Home.module.css";
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

    const {
        currentDisplay,
        showTV,
        setShowTV,
        searchValue,
        setSearchValue,
        debouncedSearchValue,
        setCurrentDisplay,
    } = useMovies();
    const [noResults, setNoResults] = useState(false);

    useEffect(() => {
        const fetchMovies = async () => {
            let url = "";
            if (debouncedSearchValue.length < 3) {
                url = `https://api.themoviedb.org/3/${
                    showTV ? "tv" : "movie"
                }/popular?language=en-US&page=1`;
            } else {
                url = `https://api.themoviedb.org/3/search/${
                    showTV ? "tv" : "movie"
                }?query=${debouncedSearchValue}&include_adult=false&language=en-US&page=1`;
            }
            try {
                const options = {
                    headers: {
                        accept: "application/json",
                        Authorization:
                            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MThlZTQ2YWUyNmZjZDMwZmZhOGYxN2I1ZjAzZWUxMCIsInN1YiI6IjY2MzY4MTM5ODNlZTY3MDEyNDQxNmYzNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mliKGz8C8ApZk3PQ2PSdXVMl8bET-v8qK--vCmIiBvc",
                    },
                };
                const response = await axios.get(url, options);
                setNoResults(response.data.results.length < 1);
                const top10 = response.data.results.slice(0, 10);

                setCurrentDisplay(
                    top10.map((item: Item) => ({
                        ...item,
                        vote_average: parseFloat(item.vote_average.toFixed(2)),
                    }))
                );
            } catch (error) {
                console.error("error:" + error);
            }
        };
        fetchMovies();
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
                    {currentDisplay.map((item, index) => (
                        <MovieCard
                            key={item.id}
                            num={index + 1}
                            src={item.poster_path}
                            title={showTV ? item.name : item.title}
                            rating={item.vote_average}
                            id={item.id}
                            showTV={showTV}
                        />
                    ))}

                    {noResults && (
                        <p className={classes.noResults}>
                            No results for "{debouncedSearchValue}"
                        </p>
                    )}
                </section>
            </main>
        </>
    );
};

export default Home;
