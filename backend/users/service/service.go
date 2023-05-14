package service

import (
	"github.com/go-chi/chi/v5"
	"github.com/jsbento/game-hub/backend/pkg/auth"
	m "github.com/jsbento/game-hub/backend/pkg/mongo"
	t "github.com/jsbento/game-hub/backend/users/types"
)

type UserService struct {
	UserStore   *m.Store
	SocialStore *m.Store
}

func Init(config *t.ServiceConfig) (*UserService, error) {
	if err := config.Validate(); err != nil {
		return nil, err
	}
	uStore, err := m.NewStore(config.DbUri, "game-hub", "users")
	if err != nil {
		return nil, err
	}
	sStore, err := m.NewStore(config.DbUri, "game-hub", "social")
	if err != nil {
		return nil, err
	}
	return &UserService{
		UserStore:   uStore,
		SocialStore: sStore,
	}, nil
}

func CreateRouter(s *UserService) chi.Router {
	r := chi.NewRouter()
	r.Post("/sign-up", s.SignUp)
	r.Post("/sign-in", s.SignIn)
	r.Post("/friends/invite", auth.CheckAuth(s.InviteFriend))
	r.Get("/friends/invites", auth.CheckAuth(s.GetFriendInvites))
	r.Get("/", s.SearchUsers)
	r.Put("/friends/invites/{id}", auth.CheckAuth(s.HandleFriendInvite))
	r.Put("/friends/{id}", auth.CheckAuth(s.RemoveFriend))
	return r
}
