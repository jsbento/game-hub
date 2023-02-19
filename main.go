package main

import (
	"fmt"
	"net/http"

	ws "github.com/gorilla/websocket"
)

var upgrader = ws.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func main() {
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			fmt.Println(err)
			return
		}
		for {
			mt, message, err := conn.ReadMessage()
			if err != nil {
				fmt.Println(err)
				return
			}
			fmt.Printf("%s sent: %s\n", conn.RemoteAddr(), message)

			if err := conn.WriteMessage(mt, message); err != nil {
				fmt.Println(err)
				return
			}
		}
	})

	http.ListenAndServe(":8080", nil)
}
