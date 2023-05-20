package connectfour

func (game *ConnectFour) Evaluate() float64 {
	return 0.0
}

func (game *ConnectFour) Search(depth int) *BoardCell {
	if game.Status != GameStatusInProgress || depth == 0 {
		return nil
	}

	possibleMoves := game.GetPossibleMoves()
	if len(possibleMoves) == 0 {
		return nil
	}
	for _, move := range possibleMoves {
		game.PlayMove(move)
		move.Score = game.Evaluate()
		game.Search(depth - 1)
		game.TakeMove()
	}

	return nil
}

func (game *ConnectFour) GetPossibleMoves() []*BoardCell {
	if game.Status != GameStatusInProgress {
		return nil
	}

	var possibleMoves []*BoardCell
	for row := 0; row < len(game.Board); row++ {
		for column := 0; column < len(game.Board[row]); column++ {
			if game.Board[row][column].Color == nil {
				possibleMoves = append(possibleMoves, game.Board[row][column])
				break
			}
		}
	}
	return possibleMoves
}

func (game *ConnectFour) PlayMove(cell *BoardCell) bool {
	if game.Status != GameStatusInProgress || game.Turn != len(game.History)%2 {
		return false
	}

	if game.Board[cell.Row][cell.Column].Color != nil {
		return false
	}

	game.Board[cell.Row][cell.Column].Color = cell.Color
	game.History = append(game.History, cell)
	game.Turn = len(game.History) % 2
	return true
}

func (game *ConnectFour) TakeMove() bool {
	if len(game.History) == 0 {
		return false
	}

	cell := game.History[len(game.History)-1]
	game.Board[cell.Row][cell.Column].Color = nil
	game.History = game.History[:len(game.History)-1]
	game.Turn = len(game.History) % 2
	return true
}

func (game *ConnectFour) CheckWin() {
	// Check for horizontal win
	for row := 0; row < len(game.Board); row++ {
		for column := 0; column < len(game.Board[row])-3; column++ {
			if game.Board[row][column].Color != nil &&
				game.Board[row][column].Color == game.Board[row][column+1].Color &&
				game.Board[row][column].Color == game.Board[row][column+2].Color &&
				game.Board[row][column].Color == game.Board[row][column+3].Color {
				game.Status = GameStatusComplete
				game.Winner = game.Board[row][column].Color
				return
			}
		}
	}

	// Check for vertical win
	for row := 0; row < len(game.Board)-3; row++ {
		for column := 0; column < len(game.Board[row]); column++ {
			if game.Board[row][column].Color != nil &&
				game.Board[row][column].Color == game.Board[row+1][column].Color &&
				game.Board[row][column].Color == game.Board[row+2][column].Color &&
				game.Board[row][column].Color == game.Board[row+3][column].Color {
				game.Status = GameStatusComplete
				game.Winner = game.Board[row][column].Color
				return
			}
		}
	}

	// Check for diagonal win (top-left to bottom-right)
	for row := 0; row < len(game.Board)-3; row++ {
		for column := 0; column < len(game.Board[row])-3; column++ {
			if game.Board[row][column].Color != nil &&
				game.Board[row][column].Color == game.Board[row+1][column+1].Color &&
				game.Board[row][column].Color == game.Board[row+2][column+2].Color &&
				game.Board[row][column].Color == game.Board[row+3][column+3].Color {
				game.Status = GameStatusComplete
				game.Winner = game.Board[row][column].Color
				return
			}
		}
	}

	// Check for diagonal win (bottom-left to top-right)
	for row := 3; row < len(game.Board); row++ {
		for column := 0; column < len(game.Board[row])-3; column++ {
			if game.Board[row][column].Color != nil &&
				game.Board[row][column].Color == game.Board[row-1][column+1].Color &&
				game.Board[row][column].Color == game.Board[row-2][column+2].Color &&
				game.Board[row][column].Color == game.Board[row-3][column+3].Color {
				game.Status = GameStatusComplete
				game.Winner = game.Board[row][column].Color
				return
			}
		}
	}

	// Check for draw
	for row := 0; row < len(game.Board); row++ {
		for column := 0; column < len(game.Board[row]); column++ {
			if game.Board[row][column].Color != nil {
				continue
			}
		}
	}

	game.Status = GameStatusDraw
}
