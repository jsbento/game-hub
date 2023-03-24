import React from "react";
import { useSelector } from "react-redux";
import { State } from "../types/State";

const NavBar: React.FC = () => {
    const user = useSelector((state:State) => state.user);

    return(
        <div className="sticky w-full h-28 bg-gradient-to-r from-sky-500 to-emerald-600">
            <ul className="h-full flex justify-end px-5 py-3 gap-12 items-center">
                <li className="mr-auto">
                    <h1 className="font-extrabold text-5xl mr-auto">
                        Game-Hub
                    </h1>
                </li>
                <li className="font-bold text-2xl">
                    <a href="/">Home</a>
                </li>
                <li className="font-bold text-2xl">
                    <a href="/games">Games</a>
                </li>
                { user ? (
                    <li className="font-bold text-2xl">
                        <a href="/profile">Profile</a>
                    </li>
                ) : (
                    <li className="font-bold text-2xl">
                        <a href="/auth">Login</a>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default NavBar;