package types

type ChallengeStatus string

const (
	ChallengeStatusPending  ChallengeStatus = "pending"
	ChallengeStatusAccepted ChallengeStatus = "accepted"
	ChallengeStatusDeclined ChallengeStatus = "declined"
)

type Challenge struct {
	Id         string          `bson:"_id" json:"id"`
	Challenger string          `bson:"challenger" json:"challenger"`
	Challengee string          `bson:"challengee" json:"challengee"`
	Status     ChallengeStatus `bson:"status" json:"status"`
}
