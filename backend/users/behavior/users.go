package behavior

import (
	m "github.com/jsbento/game-hub/backend/pkg/mongo"
	t "github.com/jsbento/game-hub/backend/users/types"
	uuid "github.com/satori/go.uuid"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (s *Store) SearchUsers(req *t.SearchUsersReq) ([]*t.User, error) {
	col := s.client.Database(s.db).Collection(s.col)

	query := m.M{}
	if req.Ids != nil {
		query["_id"] = m.M{"$in": *req.Ids}
	}
	if req.Usernames != nil {
		query["username"] = m.M{"$in": *req.Usernames}
	}
	if req.Emails != nil {
		query["email"] = m.M{"$in": *req.Emails}
	}

	options := &options.FindOptions{
		Sort: m.M{"username": 1},
	}
	if req.Limit != nil && req.Skip != nil {
		options.SetLimit(*req.Limit)
		options.SetSkip(*req.Skip)
	}

	var users []*t.User
	if err := m.Find(col, query, options, &users); err != nil {
		return nil, err
	}
	return users, nil
}

func (s *Store) UpsertUser(user *t.UpsertUser) (*t.User, error) {
	col := s.client.Database(s.db).Collection(s.col)

	if user.Id == "" {
		user.Id = uuid.NewV4().String()
	}

	var out *t.User
	err := m.Upsert(col, m.M{"_id": user.Id}, user, out)
	if err != nil {
		return nil, err
	}
	return out, nil
}
