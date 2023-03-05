package mongo

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type M bson.M

func NewMongoClient(uri string) (*mongo.Client, error) {
	return mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
}

func DisconnectMongoClient(client *mongo.Client) error {
	return client.Disconnect(context.TODO())
}

func Insert(col *mongo.Collection, data interface{}) error {
	_, err := col.InsertOne(context.TODO(), data)
	return err
}

func InsertMany(col *mongo.Collection, data []interface{}) error {
	_, err := col.InsertMany(context.TODO(), data)
	return err
}

func Update(col *mongo.Collection, filter M, data interface{}, out interface{}) error {
	return col.FindOneAndUpdate(context.TODO(), filter, M{"$set": data}).Decode(nil)
}

func UpdateMany(col *mongo.Collection, filter M, data interface{}) error {
	_, err := col.UpdateMany(context.TODO(), filter, M{"$set": data})
	if err != nil {
		return err
	}
	return nil
}

func Upsert(col *mongo.Collection, filter M, data interface{}, out interface{}) error {
	return col.FindOneAndUpdate(
		context.TODO(),
		filter,
		M{"$set": data},
		options.FindOneAndUpdate().SetUpsert(true).SetReturnDocument(options.After),
	).Decode(out)
}

func Delete(col *mongo.Collection, filter M, out interface{}) error {
	return col.FindOneAndDelete(context.TODO(), filter).Decode(out)
}

func Aggregate(col *mongo.Collection, pipe []M, out interface{}) error {
	if cur, err := col.Aggregate(context.TODO(), pipe); err == nil {
		return cur.All(context.TODO(), out)
	} else {
		return err
	}
}

func FindOne(col *mongo.Collection, filter M, out interface{}) error {
	return col.FindOne(context.TODO(), filter).Decode(out)
}

func Find(col *mongo.Collection, filter M, options *options.FindOptions, out interface{}) error {
	if cur, err := col.Find(context.TODO(), filter, options); err == nil {
		return cur.All(context.TODO(), out)
	} else {
		return err
	}
}
