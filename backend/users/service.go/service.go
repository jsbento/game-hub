package service

import (
	b "github.com/jsbento/game-hub/backend/users/behavior"
	t "github.com/jsbento/game-hub/backend/users/types"
)

type UserService struct {
	Store *b.Store
}

func Init(config *t.ServiceConfig) (*UserService, error) {
	if err := config.Validate(); err != nil {
		return nil, err
	}
	store, err := b.NewStore(config.DbUri, "game-hub", "users")
	if err != nil {
		return nil, err
	}
	return &UserService{
		Store: store,
	}, nil
}
