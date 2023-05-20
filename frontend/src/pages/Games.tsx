import React from 'react';
import { useNavigate } from 'react-router';

import ChessSet from '../assets/ChessSet.png';

const games = [
  {
    name: 'Connect Four',
    description: 'The classic game of Connect Four! Play against a friend or the computer!',
    image: ChessSet,
    route: '/games/connect-four',
  },
  {
    name: 'Chess',
    description: 'its chess',
    image: ChessSet,
    route: '/games/chess',
  },
  {
    name: 'Chess',
    description: 'its chess',
    image: ChessSet,
    route: '/games/chess',
  },
  {
    name: 'Chess',
    description: 'its chess',
    image: ChessSet,
    route: '/games/chess',
  },
];

const Games: React.FC = () => {
  const navigate = useNavigate();

  const onClickGame = ( route: string ) => {
    navigate( route );
  };

  return (
    <div className="flex w-full justify-center flex-col items-center">
      <div className="w-1/2 items-center text-center my-10 border-2 rounded-md p-4 text-white bg-sky-500">
        <h1 className="text-4xl font-bold">Games</h1>
        <h2 className="text-2xl font-semibold">
          Here you can find all the games we have to offer!
        </h2>
      </div>
      <div className="flex w-2/3 justify-center">
        {games.map(( game, i ) => (
          <GameCard {...game} key={i} onClick={onClickGame} />
        ))}
      </div>
    </div>
  );
};

interface GameCardProps {
  name: string;
  description: string;
  image: string;
  route: string;
  onClick?: ( route: string ) => void;
}

const GameCard: React.FC<GameCardProps> = ({
  name,
  description,
  image,
  route,
  onClick,
}) => {
  return (
    <div
      className="border-2 border-black shadow-xl rounded-md max-w-[250px] h-[400px] m-3 cursor-pointer bg-slate-100 hover:scale-105 transition-transform duration-300"
      onClick={() => onClick && onClick( route )}
    >
      <img src={image} alt={name} />
      <div className="bg-emerald-600 font-bold text-3xl text-white">
        <p className="p-2">{name}</p>
      </div>
      <div className="font-semibold text-lg max-h-40overflow-y-scroll rounded-b-md">
        <p className="p-2">{description}</p>
      </div>
    </div>
  );
};

export default Games;
