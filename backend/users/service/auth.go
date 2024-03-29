package service

import (
	"net/http"

	"github.com/jsbento/game-hub/backend/pkg/api"
	"github.com/jsbento/game-hub/backend/pkg/auth"
	m "github.com/jsbento/game-hub/backend/pkg/mongo"
	t "github.com/jsbento/game-hub/backend/users/types"
	uuid "github.com/satori/go.uuid"
	"go.mongodb.org/mongo-driver/mongo"
)

func (s *UserService) SignUp(w http.ResponseWriter, r *http.Request) {
	var user t.User
	api.Parse(r, &user)

	existingUser := t.User{}
	if err := s.UserStore.FindOne(m.M{
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
	user.Roles = []string{"base"}

	if err := s.UserStore.Insert(user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	token, err := auth.GenToken(user.Id, user.Username, user.Email, user.Roles)
	if err != nil {
		http.Error(w, "Failed to generate auth token", http.StatusBadRequest)
		return
	}

	resp := &t.UserWithToken{
		User: &user,
		Token: auth.Token{
			UserId: user.Id,
			Roles:  user.Roles,
			Token:  token,
		},
	}

	api.WriteJSON(w, http.StatusOK, resp)
}

func (s *UserService) SignIn(w http.ResponseWriter, r *http.Request) {
	req := &auth.AuthorizationReq{}
	api.Parse(r, req)

	user := t.User{}
	if err := s.UserStore.FindOne(m.M{"username": req.Username}, &user); err != nil {
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

	resp := &t.UserWithToken{
		User: &user,
		Token: auth.Token{
			UserId: user.Id,
			Roles:  user.Roles,
			Token:  token,
		},
	}
	api.WriteJSON(w, http.StatusOK, resp)
}
