import axios from "axios";
import classes from "../styles/TitleInfo.module.css";
import { useParams } from "react-router-dom";
import { useMovies } from "../Components/MovieProvider";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import BeatLoader from "react-spinners/BeatLoader";

const MovieInfo: React.FC = () => {
    const { currentDisplay } = useMovies();
    const { id } = useParams();
    const { type } = useParams();
    const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
    const [currentTitle, setCurrentTitle] = useState(
        currentDisplay.find((movie) => movie.id == id)
    );
    const titleRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // in case a refresh happens and we lose information about the current title
    useEffect(() => {
        if (window.innerWidth < 768) setIsMobile(true);

        if (titleRef.current) {
            gsap.fromTo(
                titleRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.5, delay: 0.3 }
            );
        }
        if (currentTitle) return;
        setIsLoading(true);
        const options = {
            headers: {
                accept: "application/json",
                Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MThlZTQ2YWUyNmZjZDMwZmZhOGYxN2I1ZjAzZWUxMCIsInN1YiI6IjY2MzY4MTM5ODNlZTY3MDEyNDQxNmYzNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mliKGz8C8ApZk3PQ2PSdXVMl8bET-v8qK--vCmIiBvc",
            },
        };

        axios
            .get(
                `https://api.themoviedb.org/3/${
                    type === "movie" ? "movie" : "tv"
                }/${id}?append_to_response=videos&language=en-US`,
                options
            )
            .then((response) => {
                console.log(response.data);
                if (response.data.success !== false) {
                    setCurrentTitle(response.data);
                }
                setIsLoading(false);
            })
            .catch((err) => {
                alert(err);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!currentTitle) return;
        const options = {
            headers: {
                accept: "application/json",
                Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MThlZTQ2YWUyNmZjZDMwZmZhOGYxN2I1ZjAzZWUxMCIsInN1YiI6IjY2MzY4MTM5ODNlZTY3MDEyNDQxNmYzNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mliKGz8C8ApZk3PQ2PSdXVMl8bET-v8qK--vCmIiBvc",
            },
        };

        axios
            .get(
                `https://api.themoviedb.org/3/${
                    type === "movie" ? "movie" : "tv"
                }/${id}/videos?language=en-US`,
                options
            )
            .then((response) => {
                const trailer = response.data.results.find(
                    (video: { type: string; key: string }) =>
                        video.type === "Trailer"
                );

                if (trailer) {
                    setTrailerUrl(
                        `https://www.youtube.com/embed/${trailer.key}`
                    );
                }
            })
            .catch((err) => {
                alert(err);
            });
    }, [currentTitle]);

    if (isLoading) {
        return (
            <div className="loader-holder">
                <BeatLoader color="#56B4E9" size={25} />
            </div>
        );
    }

    return currentTitle ? (
        <main className={classes.titleContainer} ref={titleRef}>
            <Link to="/" className={`${classes.caretContainer}`}>
                <i className={`fa-solid fa-caret-left`}></i>
                <span>Back</span>
            </Link>
            {!trailerUrl ? (
                <img
                    src={`https://image.tmdb.org/t/p/${
                        isMobile ? "w500" : "w780"
                    }${currentTitle.backdrop_path}`}
                    alt={`${currentTitle.name} banner photo`}
                />
            ) : (
                <iframe
                    width="100%"
                    height="315"
                    src={trailerUrl}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            )}
            <h1>{currentTitle.name || currentTitle.title}</h1>
            <p>{currentTitle.overview}</p>
        </main>
    ) : (
        <div>
            <p className={classes.invalidTitle}>Invalid title</p>
            <Link to="/" className={`${classes.backHome}`}>
                Back to home
            </Link>
        </div>
    );
};

export default MovieInfo;
