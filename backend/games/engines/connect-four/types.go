package connectfour

type GameStatus string

const (
	GameStatusInProgress GameStatus = "in-progress"
	GameStatusComplete   GameStatus = "complete"
	GameStatusDraw       GameStatus = "draw"
)

type ConnectFour struct {
	Turn    int            `json:"turn"`
	Board   [][]*BoardCell `json:"board"`
	Status  GameStatus     `json:"status"`
	Winner  *string        `json:"winner"`
	History []*BoardCell   `json:"history"`
}

type BoardCell struct {
	Row    int     `json:"row"`
	Column int     `json:"column"`
	Color  *string `json:"color"`
	Score  float64 `json:"score"`
}
