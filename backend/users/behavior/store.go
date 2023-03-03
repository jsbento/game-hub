package behavior

import (
	m "github.com/jsbento/game-hub/backend/pkg/mongo"
	"go.mongodb.org/mongo-driver/mongo"
)

type Store struct {
	client *mongo.Client
	db     string
	col    string
}

func NewStore(dbUri, db, col string) (*Store, error) {
	client, err := m.NewMongoClient(dbUri)
	if err != nil {
		return nil, err
	}
	return &Store{client, db, col}, nil
}
