import React from "react";

const Home: React.FC = () => {
    return (
        <div className="flex w-full justify-center">
            <div className="w-1/2 items-center text-center my-10 border-2 rounded-md p-4 text-white bg-sky-500">
                <h1 className="text-4xl font-bold">Welcome to the Game-Hub!</h1>
                <h2 className="text-2xl font-semibold">Your one stop shop for all things gaming!</h2>
            </div>
        </div>
    );
}

export default Home;