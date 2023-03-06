package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/jsbento/game-hub/backend/chat"
	uS "github.com/jsbento/game-hub/backend/users/service"
	uT "github.com/jsbento/game-hub/backend/users/types"
)

var addr = flag.String("addr", ":8080", "http service address")

func main() {
	flag.Parse()
	hub := chat.NewHub()

	userSvc, err := uS.Init(&uT.ServiceConfig{
		DbUri: "mongodb://localhost:27017",
	})
	if err != nil {
		log.Fatalf("failed to init user service: %v\n", err)
	}

	go hub.Run()
	http.HandleFunc("/ws-chat", func(w http.ResponseWriter, r *http.Request) {
		chat.ServeWs(hub, w, r)
	})
	err = http.ListenAndServe(*addr, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
