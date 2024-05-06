import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import TitleInfo from "./pages/TitleInfo";
import { MovieProvider } from "./Components/MovieProvider";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <NotFound />,
    },
    {
        path: "/title/:type/:id",
        element: <TitleInfo />,
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <MovieProvider>
            <RouterProvider router={router} />
        </MovieProvider>
    </React.StrictMode>
);
