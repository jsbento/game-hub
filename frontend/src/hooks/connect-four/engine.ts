import { useState, useEffect } from 'react';
import { ConnectFourCell } from '../../types/games/ConnectFour';

const getNextMove = ( board: ConnectFourCell[][] ): ConnectFourCell | null => {
  return null;
}

export const useConnectFourEngine = (
  turn: 'red' | 'yellow',
  engineColor: 'red' | 'yellow',
  board: ConnectFourCell[][],
) => {
  const [ engineMove, setEngineMove ] = useState<ConnectFourCell | null>( null );

  useEffect(() => {
    if( turn !== engineColor ) {
      return;
    }

    setEngineMove( getNextMove( board ));
  }, [ turn ])

  return engineMove;
}