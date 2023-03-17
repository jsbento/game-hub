package api

import (
	"net/http"

	"github.com/gorilla/schema"
	j "github.com/helloeave/json"
)

func WriteJSON(w http.ResponseWriter, code int, data interface{}) {
	b, err := j.MarshalSafeCollections(data)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(b)
}

func Parse(r *http.Request, out interface{}) {
	if r.Method == http.MethodGet {
		if err := schema.NewDecoder().Decode(out, r.URL.Query()); err != nil {
			panic(err)
		}
	} else if err := j.NewDecoder(r.Body).Decode(out); err != nil {
		panic(err)
	}
}
