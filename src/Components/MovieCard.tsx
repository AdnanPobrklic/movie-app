import React from "react";
import classes from "../styles/MovieCard.module.css";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useEffect, useRef } from "react";

interface MovieCardProps {
    src: string;
    title: string;
    rating: number;
    num: number;
    id: number;
    showTV: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({
    src,
    title,
    rating,
    num,
    id,
    showTV,
}) => {
    const cardRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            cardRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.2, delay: num * 0.1 }
        );
    }, [num]);

    return (
        <div className={classes.movieCard} ref={cardRef}>
            <Link to={`title/${showTV ? "tv" : "movie"}/${id}`}>
                <div className={classes.cardImageContainer}>
                    <img
                        loading="lazy"
                        src={`https://image.tmdb.org/t/p/w500${src}`}
                        alt={`${title} poster image`}
                    />
                </div>
                <div className={classes.movieInfo}>
                    <p>
                        <i className="fa-solid fa-star"></i>
                        {rating}
                    </p>
                    <h3>{`${num}. ${title}`}</h3>
                </div>
            </Link>
        </div>
    );
};

export default MovieCard;
