import React, { useCallback } from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { State } from "../types/State";
import { clearState } from "../state/actions/Actions";

const NavBar: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector(( state:State ) => state.user );

    const clear = useCallback(() => dispatch( clearState() ), [ dispatch ]);

    const onLogout = () => {
        clear();
        navigate("/");
    }

    return(
        <div className="sticky w-full h-28 bg-gradient-to-r from-sky-500 to-emerald-600">
            <ul className="h-full flex justify-end px-5 py-3 gap-12 items-center">
                <li className="mr-auto">
                    <h1 className="font-extrabold text-5xl mr-auto text-white">
                        Game-Hub
                    </h1>
                </li>
                <li className="font-bold text-xl">
                    <p className="cursor-pointer" onClick={ () => navigate( "/" ) }>Home</p>
                </li>
                <li className="font-bold text-xl">
                    <p className="cursor-pointer" onClick={ () => navigate( "/games" ) }>Games</p>
                </li>
                { user ? (
                    <>
                        <li className="font-bold text-xl">
                            <p className="cursor-pointer" onClick={ () => navigate("/profile") }>Profile</p>
                        </li>
                        <li className="font-bold text-xl">
                            <p className="cursor-pointer" onClick={ onLogout }>Logout</p>
                        </li>
                    </>
                ) : (
                    <li className="font-bold text-xl">
                        <p className="cursor-pointer" onClick={ () => navigate( "/auth" ) }>Login</p>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default NavBar;