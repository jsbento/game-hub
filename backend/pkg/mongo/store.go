package mongo

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Store struct {
	client *mongo.Client
	db     string
	col    string
}

func NewStore(dbUri, db, col string) (*Store, error) {
	client, err := newMongoClient(dbUri)
	if err != nil {
		return nil, err
	}
	return &Store{client, db, col}, nil
}

func (s *Store) Disconnect() error {
	return s.client.Disconnect(context.TODO())
}

func (s *Store) Insert(data interface{}) error {
	return insert(s.client.Database(s.db).Collection(s.col), data)
}

func (s *Store) InsertMany(data []interface{}) error {
	return insertMany(s.client.Database(s.db).Collection(s.col), data)
}

func (s *Store) Update(filter M, data interface{}) error {
	return update(s.client.Database(s.db).Collection(s.col), filter, data, nil)
}

func (s *Store) UpdateMany(filter M, data interface{}) error {
	return updateMany(s.client.Database(s.db).Collection(s.col), filter, data)
}

func (s *Store) Upsert(filter M, data interface{}, out interface{}) error {
	return upsert(s.client.Database(s.db).Collection(s.col), filter, data, out)
}

func (s *Store) Find(filter M, options *options.FindOptions, out interface{}) error {
	return find(s.client.Database(s.db).Collection(s.col), filter, options, out)
}

func (s *Store) FindOne(filter M, out interface{}) error {
	return findOne(s.client.Database(s.db).Collection(s.col), filter, out)
}

func (s *Store) Delete(filter M, out interface{}) error {
	return delete(s.client.Database(s.db).Collection(s.col), filter, out)
}

func (s *Store) DeleteMany(filter M) error {
	return deleteMany(s.client.Database(s.db).Collection(s.col), filter)
}

func (s *Store) Aggregate(pipe []M, out interface{}) error {
	return aggregate(s.client.Database(s.db).Collection(s.col), pipe, out)
}
