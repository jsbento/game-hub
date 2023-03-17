package types

type User struct {
	Id       string   `bson:"_id" json:"id"`
	Username string   `bson:"username" json:"username"`
	Password string   `bson:"password" json:"password"`
	Email    string   `bson:"email" json:"email"`
	Roles    []string `bson:"roles" json:"roles"`
	Friends  []string `bson:"friends" json:"friends"`
}

type UpsertUser struct {
	Id       string    `bson:"_id" json:"id"`
	Username *string   `bson:"username" json:"username"`
	Password *string   `bson:"password" json:"password"`
	Email    *string   `bson:"email" json:"email"`
	Roles    *[]string `bson:"roles" json:"roles"`
	Friends  *[]string `bson:"friends" json:"friends"`
}
