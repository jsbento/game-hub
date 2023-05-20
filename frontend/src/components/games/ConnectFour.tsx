import React, { useState, useEffect } from 'react';
import { ConnectFourCell } from '../../types/games/ConnectFour';

const ConnectFour: React.FC = () => {
  const [ board, setBoard ] = useState<ConnectFourCell[][]>([[]]);
  const [ highlightedCells, setHighlightedCells ] = useState<ConnectFourCell[]>([]);

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
    setHighlightedCells( [] );
  }

  const onClickCell = ( cell: ConnectFourCell ) => {
    for( let i = board.length - 1; i >= 0; i-- ) {
      if( board[i][cell.col].color === null ) {
        board[i][cell.col] = {
          ...board[i][cell.col],
          color: 'bg-red-500',
        };
        setBoard( [ ...board ] );
        break;
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
    return board.map(( row: ConnectFourCell[], idx: number ) => (
      <div key={idx} className="flex flex-row">
        { row.map(( cell: ConnectFourCell, idx: number ) => (
          <BoardCell
            key={idx}
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
    if( cell.color ) {
      setColor( cell.color );
    } else if( isHighlighted ) {
      setColor( 'bg-green-300' );
    } else {
      setColor( 'bg-neutral-200' );
    }
  }, [ cell.color, isHighlighted ])

  return (
    <div
      className={ `w-10 h-10 border-2 border-blue-600 rounded-full m-1 ${ color }` }
      onMouseEnter={ () => onMouseEnter( cell ) }
      onMouseLeave={ () => onMouseLeave() }
      onClick={ () => onClick( cell ) }
    />
  )
}

export default ConnectFour;