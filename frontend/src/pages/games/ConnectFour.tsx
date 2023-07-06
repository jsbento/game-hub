import React from 'react';
import { default as ConnectFourGame } from '../../components/games/ConnectFour';

const ConnectFour: React.FC = () => {
  return (
    <div className="flex flex-col w-full p-2">
      <ConnectFourGame mode='pve' />
    </div>
  );
};

export default ConnectFour;