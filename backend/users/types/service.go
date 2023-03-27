package types

import (
	"errors"

	"github.com/jsbento/game-hub/backend/pkg/auth"
)

type SearchUsersReq struct {
	Ids       *[]string `json:"ids"`
	Usernames *[]string `json:"usernames"`
	Emails    *[]string `json:"emails"`
	Limit     *int64    `json:"limit"`
	Skip      *int64    `json:"skip"`
}

func (r *SearchUsersReq) Validate() error {
	if r.Limit != nil && r.Skip == nil {
		return errors.New("missing skip in limit query")
	}
	if r.Limit == nil && r.Skip != nil {
		return errors.New("missing limit in skip query")
	}
	return nil
}

type UserWithToken struct {
	User  *User `json:"user"`
	Token auth.Token
}
