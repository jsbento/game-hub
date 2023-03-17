package auth

type AuthorizationReq struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type Token struct {
	UserId string   `json:"userId"`
	Roles  []string `json:"roles"`
	Token  string   `json:"token"`
}
