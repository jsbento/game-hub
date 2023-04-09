import React, { useState } from "react";
import { useSelector } from "react-redux";
import { User } from "../../types/Users";
import { State } from "../../types/State";

import InfoTab from "./sections/InfoTab";
import SocialTab from "./sections/SocialTab";
import GamesTab from "./sections/GamesTab";

const TABS = [
    "Personal Information",
    "Social",
    "Games",
]

const Profile: React.FC = () => {
    const user: User | null = useSelector(( state: State ) => state.user );
    const [ activeTab, setActiveTab ] = useState<string>( "" );
    
    return (
        user && (
            <div className="flex flex-col w-full mt-5">
                <h1 className="font-bold p-3 text-3xl w-full text-center">{ `Hello ${ user.username }!` }</h1>
                <div className="flex flex-row w-full mx-3 justify-center">
                    <div className="w-1/6 pl-5 flex-col h-[650px] bg-sky-500 text-white rounded-l-lg">
                        { TABS.map(( tab, idx ) => (
                            <p
                                key={ idx }
                                className="text-xl font-semibold my-7 cursor-pointer hover:scale-105 transition-transform duration-300"
                                onClick={ () => setActiveTab( tab ) }
                            >
                                { tab }
                            </p>
                        ))}
                    </div>
                    <div className="bg-gray-50 w-4/6 rounded-r-lg">
                        { activeTab === "Personal Information" && <InfoTab user={ user } /> }
                        { activeTab === "Social" && <SocialTab /> }
                        { activeTab === "Games" && <GamesTab /> }
                    </div>
                </div>
            </div>
        )
    );
}

export default Profile;