package types

type SearchGamesReq struct {
	Ids   *[]string `json:"ids"`
	Types *[]string `json:"types"`
}
