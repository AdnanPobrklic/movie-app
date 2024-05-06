import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import classes from "../styles/MovieCard.module.css";

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
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.fromTo(
            cardRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.2, delay: num * 0.1 }
        );
    }, [num]);

    const cardStyle = {
        backgroundImage: `url(https://image.tmdb.org/t/p/w780${src})`,
    };

    return (
        <div className={classes.movieCard} ref={cardRef}>
            <Link to={`title/${showTV ? "tv" : "movie"}/${id}`}>
                <div
                    className={classes.cardImageContainer}
                    style={cardStyle}
                ></div>
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
