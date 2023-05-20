package connectfour

type ConnectFour struct {
	Board [][]*BoardCell `json:"board"`
}

type BoardCell struct {
	Row    int     `json:"row"`
	Column int     `json:"column"`
	Color  *string `json:"color"`
}
