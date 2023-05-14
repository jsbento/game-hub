package service

import (
	"net/http"

	"github.com/jsbento/game-hub/backend/pkg/api"
	m "github.com/jsbento/game-hub/backend/pkg/mongo"
	t "github.com/jsbento/game-hub/backend/users/types"
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
