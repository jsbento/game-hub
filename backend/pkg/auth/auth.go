package auth

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func GenToken(id, username, email string, roles []string) (string, error) {
	signingKey := []byte(os.Getenv("JWT_SECRET_KEY"))
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"authorized": true,
		"userId":     id,
		"username":   username,
		"email":      email,
		"roles":      roles,
		"exp":        time.Now().Add(36 * time.Hour).Unix(),
	})

	tknString, err := token.SignedString(signingKey)
	if err != nil {
		return "", err
	}

	return tknString, nil
}
