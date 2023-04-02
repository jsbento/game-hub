package main

import (
	"log"
	"net/http"
	"os"

	// "github.com/jsbento/game-hub/backend/chat"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	uS "github.com/jsbento/game-hub/backend/users/service"
	uT "github.com/jsbento/game-hub/backend/users/types"
)

func main() {
	err := godotenv.Load("./.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	//hub := chat.NewHub()

	userSvc, err := uS.Init(&uT.ServiceConfig{
		DbUri: os.Getenv("MONGODB_URI"),
	})
	if err != nil {
		log.Fatalf("failed to init user service: %v\n", err)
	}
	uRouter := uS.CreateRouter(userSvc)

	serverRouter := chi.NewRouter()
	serverRouter.Use(middleware.Logger)
	serverRouter.Use(middleware.Recoverer)
	serverRouter.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "Token", "UserId", "Roles"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}).Handler)

	serverRouter.Mount("/users", uRouter)

	log.Println("Server running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", serverRouter))
	// go hub.Run()
	// http.HandleFunc("/ws-chat", func(w http.ResponseWriter, r *http.Request) {
	// 	chat.ServeWs(hub, w, r)
	// })
	// err = http.ListenAndServe(*addr, nil)
	// if err != nil {
	// 	log.Fatal("ListenAndServe: ", err)
	// }
}
