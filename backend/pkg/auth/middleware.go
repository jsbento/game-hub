package auth

import (
	"errors"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt"
)

func CheckAuth(handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Header["Token"] == nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		key := []byte(os.Getenv("JWT_SECRET_KEY"))

		token, err := jwt.Parse(r.Header["Token"][0], func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("unexpected signing method")
			}
			return key, nil
		})
		if err != nil {
			http.Error(w, "Unauthorized or session expired", http.StatusUnauthorized)
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			roles, ok := claims["roles"].(string)
			if !ok {
				log.Println("roles not found in token")
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}
			r.Header.Set("UserId", claims["userId"].(string))
			r.Header.Set("Roles", roles)
			handler.ServeHTTP(w, r)
			return
		}
		log.Println("missing claims or token invalid")

		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
}

func GetUserData(r *http.Request) *struct {
	Id    string
	Email string
	Roles []string
} {
	if r.Header["Token"] == nil {
		return nil
	}

	key := []byte(os.Getenv("JWT_SECRET_KEY"))
	token, err := jwt.Parse(r.Header["Token"][0], func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return key, nil
	})
	if err != nil {
		return nil
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		roles, ok := claims["roles"].(string)
		if !ok {
			return nil
		}
		userId, ok := claims["userId"].(string)
		if !ok {
			return nil
		}
		email, ok := claims["email"].(string)
		if !ok {
			return nil
		}

		return &struct {
			Id    string
			Email string
			Roles []string
		}{
			Id:    userId,
			Email: email,
			Roles: strings.Split(roles, ","),
		}
	}
	return nil
}
