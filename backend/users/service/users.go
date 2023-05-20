package service

import (
	"errors"
	"net/http"

	"github.com/jsbento/game-hub/backend/pkg/api"
	"github.com/jsbento/game-hub/backend/pkg/auth"
	m "github.com/jsbento/game-hub/backend/pkg/mongo"
	t "github.com/jsbento/game-hub/backend/users/types"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (s *UserService) SearchUsers(w http.ResponseWriter, r *http.Request) {
	req := t.SearchUsersReq{}
	api.Parse(r, &req)

	q := m.M{}
	if req.Ids != nil {
		q["_id"] = m.M{"$in": *req.Ids}
	}
	if req.Usernames != nil {
		q["username"] = m.M{"$in": *req.Usernames}
	}
	if req.Emails != nil {
		q["email"] = m.M{"$in": *req.Emails}
	}

	options := options.Find()
	if req.Limit != nil && req.Skip != nil {
		options.SetLimit(*req.Limit)
		options.SetSkip(*req.Skip)
	}

	var users []*t.User
	err := s.UserStore.Find(q, options, &users)
	api.CheckError(w, http.StatusInternalServerError, err)

	api.WriteJSON(w, http.StatusOK, users)
}

func (s *UserService) UpdateUser(w http.ResponseWriter, r *http.Request) {
	req := t.UpsertUser{}
	api.Parse(r, &req)

	if req.Username != nil {
		existingUser := t.User{}
		if err := s.UserStore.FindOne(m.M{"username": *req.Username}, &existingUser); err != nil && err != mongo.ErrNoDocuments {
			api.CheckError(w, http.StatusInternalServerError, err)
			return
		} else if err == nil {
			api.CheckError(w, http.StatusUnprocessableEntity, errors.New("Username already exists"))
			return
		}
	}

	if req.Password != nil {
		hashPass, err := auth.HashPassword(*req.Password)
		api.CheckError(w, http.StatusInternalServerError, err)
		req.Password = &hashPass
	}

	updated := t.User{}
	err := s.UserStore.Update(m.M{"_id": req.Id}, m.M{"$set": req}, &updated)
	api.CheckError(w, http.StatusInternalServerError, err)
	api.WriteJSON(w, http.StatusOK, updated)
}
