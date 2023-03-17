package service

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jsbento/game-hub/backend/pkg/api"
	"github.com/jsbento/game-hub/backend/pkg/auth"
	m "github.com/jsbento/game-hub/backend/pkg/mongo"
	t "github.com/jsbento/game-hub/backend/users/types"
	uuid "github.com/satori/go.uuid"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserService struct {
	Store *m.Store
}

func Init(config *t.ServiceConfig) (*UserService, error) {
	if err := config.Validate(); err != nil {
		return nil, err
	}
	store, err := m.NewStore(config.DbUri, "game-hub", "users")
	if err != nil {
		return nil, err
	}
	return &UserService{
		Store: store,
	}, nil
}

func CreateRouter(s *UserService) chi.Router {
	r := chi.NewRouter()
	r.Post("/sign-up", s.SignUp)
	r.Post("/sign-in", s.SignIn)
	return r
}

func (s *UserService) SignUp(w http.ResponseWriter, r *http.Request) {
	var user t.User
	api.Parse(r, &user)

	existingUser := t.User{}
	if err := s.Store.FindOne(m.M{
		"$or": []m.M{
			{"email": user.Email},
			{"username": user.Username},
		},
	}, &existingUser); err != nil && err != mongo.ErrNoDocuments {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	} else if err == nil {
		http.Error(w, "User already exists", http.StatusUnprocessableEntity)
		return
	}

	hashPass, err := auth.HashPassword(user.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	user.Id = uuid.NewV4().String()
	user.Password = hashPass

	if err := s.Store.Insert(user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	api.WriteJSON(w, http.StatusOK, user)
}

func (s *UserService) SignIn(w http.ResponseWriter, r *http.Request) {
	req := &auth.AuthorizationReq{}
	api.Parse(r, req)

	user := t.User{}
	if err := s.Store.FindOne(m.M{"username": req.Username}, &user); err != nil {
		http.Error(w, "Username or password is incorrect", http.StatusNotFound)
		return
	}

	if !auth.CheckPasswordHash(req.Password, user.Password) {
		http.Error(w, "Username or password is incorrect", http.StatusNotFound)
		return
	}

	token, err := auth.GenToken(user.Id, user.Username, user.Email, user.Roles)
	if err != nil {
		http.Error(w, "Failed to generate auth token", http.StatusBadRequest)
		return
	}

	tkn := auth.Token{
		UserId: user.Id,
		Roles:  user.Roles,
		Token:  token,
	}
	api.WriteJSON(w, http.StatusOK, tkn)
}
