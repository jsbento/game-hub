package types

type FriendRequest struct {
	Id   string `bson:"_id" json:"id"`
	From string `bson:"from" json:"from"`
	To   string `bson:"to" json:"to"`
}
