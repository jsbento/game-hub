package jwt

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/joho/godotenv"
)

func generateToken() (string, error) {
	err := godotenv.Load()
	if err != nil {
		log.Println(err)
		return "", err
	}

	secret := os.Getenv("JWT_SECRET")
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["exp"] = time.Now().Add(time.Hour * 24)
	claims["iat"] = time.Now()
	claims["authorized"] = true
	claims["user"] = "test"

	tkn, err := token.SignedString([]byte(secret))
	if err != nil {
		log.Println(err)
		return "", err
	}

	return tkn, nil
}

func verifyToken(handler func(w http.ResponseWriter, r *http.Request)) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header["Token"] != nil {
			token, err := jwt.Parse(r.Header["Token"][0], func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					w.WriteHeader(http.StatusUnauthorized)
					_, err := w.Write([]byte("Unauthorized"))
					if err != nil {
						log.Println(err)
						return nil, err
					}
				}
				return "", nil
			})
			if err != nil {
				w.WriteHeader(http.StatusUnauthorized)
				_, err := w.Write([]byte("Unauthorized"))
				if err != nil {
					log.Println(err)
					return
				}
			}
			if token.Valid {
				handler(w, r)
			} else {
				w.WriteHeader(http.StatusUnauthorized)
				_, err := w.Write([]byte("Unauthorized"))
				if err != nil {
					log.Println(err)
					return
				}
			}
		}
	})
}

func getClaims(_ http.ResponseWriter, r *http.Request) (string, error) {
	if r.Header["Token"] != nil {
		token := r.Header["Token"][0]
		tkn, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(os.Getenv("JWT_SECRET")), nil
		})
		if err != nil {
			return "", err
		}
		if claims, ok := tkn.Claims.(jwt.MapClaims); ok && tkn.Valid {
			return claims["user"].(string), nil
		}
	}
	return "", errors.New("Unauthorized")
}
