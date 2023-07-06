import React, { useState, useEffect } from 'react';
import { ConnectFourCell } from '../../types/games/ConnectFour';

const RED = 'rgb(239, 68, 68)';
const YELLOW = 'rgb(250, 204, 21)';
const NEUTRAL = 'rgb(229, 229, 229)';
const HIGHLIGHT = 'rgb(134, 239, 72)';

interface ConnectFourProps {
  mode: 'pvp' | 'pve'
}

const ConnectFour: React.FC<ConnectFourProps> = ({ mode }) => {
  const [ board, setBoard ] = useState<ConnectFourCell[][]>([[]]);
  const [ highlightedCells, setHighlightedCells ] = useState<ConnectFourCell[]>([]);
  const [ turn, setTurn ] = useState<'red' | 'yellow'>( 'red' );
  const [ history, setHistory ] = useState<ConnectFourCell[]>([]);

  useEffect(() => {
    initBoard();
  }, [])

  const onMouseEnter = ( cell: ConnectFourCell ) => {
    const toHighlight: ConnectFourCell[] = [];
    for( let i = 0; i < 6; i++ ) {
      toHighlight.push({
        row: i,
        col: cell.col,
        color: null,
      });
    }

    setHighlightedCells( toHighlight );
  }

  const onMouseLeave = () => {
    setHighlightedCells([]);
  }

  const onClickCell = ( cell: ConnectFourCell ) => {
    for( let i = board.length - 1; i >= 0; i-- ) {
      if( board[i][cell.col].color === null ) {
        const newCell: ConnectFourCell = {
          ...board[i][cell.col],
          color: turn === 'red' ? RED : YELLOW,
        };
        board[i][cell.col] = newCell;

        setBoard([ ...board ]);
        setHistory([ ...history, newCell ]);
        setTurn( turn === 'red' ? 'yellow' : 'red' );
        return;
      }
    }
  }

  const initBoard = () => {
    const board: ConnectFourCell[][] = [];
    for( let i = 0; i < 6; i++ ) {
      const row: ConnectFourCell[] = [];
      for( let j = 0; j < 7; j++ ) {
        row.push({
          row: i,
          col: j,
          color: null,
        });
      }
      board.push( row );
    }

    setBoard( board );
  }

  const renderBoard = () => {
    return board.map(( row: ConnectFourCell[], rIdx: number ) => (
      <div key={rIdx} className="flex flex-row">
        { row.map(( cell: ConnectFourCell, cIdx: number ) => (
          <BoardCell
            key={cIdx}
            cell={cell}
            isHighlighted={ highlightedCells.some( c => c.row === cell.row && c.col === cell.col ) }
            onMouseEnter={ onMouseEnter }
            onMouseLeave={ onMouseLeave }
            onClick={ onClickCell }
          />
        ))}
      </div>
    ))
  }

  return (
    <div className="flex flex-col w-fit p-2 bg-blue-400 rounded-lg border-2 border-blue-600">
      { renderBoard() }
    </div>
  )
}

interface BoardCellProps {
  cell: ConnectFourCell;
  isHighlighted: boolean;
  onMouseEnter: ( cell: ConnectFourCell ) => void;
  onMouseLeave: () => void;
  onClick: ( cell: ConnectFourCell ) => void;
}

const BoardCell: React.FC<BoardCellProps> = ({ cell, isHighlighted, onMouseEnter, onMouseLeave, onClick }) => {
  const [ color, setColor ] = useState<string>( 'bg-neutral-200' );

  useEffect(() => {
    if( cell.color !== null ) {
      setColor( cell.color );
    } else if( isHighlighted ) {
      setColor( HIGHLIGHT );
    } else {
      setColor( NEUTRAL );
    }
  }, [ cell.color, isHighlighted ])

  return (
    <div
      style={{ backgroundColor: color }}
      className="w-10 h-10 border-2 border-blue-600 rounded-full m-1"
      onMouseEnter={ () => onMouseEnter( cell ) }
      onMouseLeave={ () => onMouseLeave() }
      onClick={ () => onClick( cell ) }
    />
  )
}

export default ConnectFour;