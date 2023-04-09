package types

type GameType string

const (
	Chess GameType = "chess"
)

type ActiveGame struct {
	Id      string      `json:"id"`
	Type    GameType    `json:"type"`
	Players []string    `json:"players"`
	History interface{} `json:"history"`
}
