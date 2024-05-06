import { Link } from "react-router-dom";
import classes from "../styles/NotFound.module.css";

export default function NotFound() {
    return (
        <div className={classes.notFoundContainer}>
            <h1>
                Sorry this route does not exist &nbsp;
                <i className={`fa-solid fa-ban ${classes.notFoundIcon}`}></i>
            </h1>
            <Link to={"/"}>Back to home</Link>
        </div>
    );
}
