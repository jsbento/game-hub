import React from "react";
import { User } from "../../../types/Users";

interface InfoTabProps {
    user: User | null;
}

const InfoTab: React.FC<InfoTabProps> = ({ user }) => {
    if( !user ) return null;

    return (
        <div className="flex flex-col w-full p-2">
            <div className="flex flex-row w-full justify-center">
                <div className="flex flex-col w-1/2">
                    <p className="font-semibold text-xl">Username</p>
                    <p className="font-semibold text-xl">Email</p>

                </div>
                <div className="flex flex-col w-1/2">   
                    <p className="font-semibold text-xl">{ user.username }</p>
                    <p className="font-semibold text-xl">{ user.email }</p>
                </div>
            </div>
        </div>
    )
}

export default InfoTab;