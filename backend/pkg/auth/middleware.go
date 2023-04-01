package auth

import (
	"errors"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt"
)

// USE COOKIES?!?!?!?!?!?!?!?!?!?!?!?!?!?!?!?!?!?!?!
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
			roles, ok := claims["roles"].([]string)
			if !ok {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}
			r.Header.Set("UserId", claims["userId"].(string))
			r.Header.Set("Roles", strings.Join(roles, ","))
			handler.ServeHTTP(w, r)
			return
		}

		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
}
