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
	Username *string   `bson:"username,omitempty" json:"username,omitempty"`
	Password *string   `bson:"password,omitempty" json:"password,omitempty"`
	Email    *string   `bson:"email,omitempty" json:"email,omitempty"`
	Roles    *[]string `bson:"roles,omitempty" json:"roles,omitempty"`
	Friends  *[]string `bson:"friends,omitempty" json:"friends,omitempty"`
}
