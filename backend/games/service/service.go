package service

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	t "github.com/jsbento/game-hub/backend/games/types"
	"github.com/jsbento/game-hub/backend/pkg/api"
	"github.com/jsbento/game-hub/backend/pkg/auth"
	m "github.com/jsbento/game-hub/backend/pkg/mongo"
	uuid "github.com/satori/go.uuid"
)

type GameService struct {
	ActiveGames    map[string]*t.ActiveGame
	GameStore      *m.Store
	ChallengeStore *m.Store
}

func Init(config *t.ServiceConfig) (*GameService, error) {
	if err := config.Validate(); err != nil {
		return nil, err
	}
	gStore, err := m.NewStore(config.DbUri, "game-hub", "games")
	if err != nil {
		return nil, err
	}
	cStore, err := m.NewStore(config.DbUri, "game-hub", "challenges")
	if err != nil {
		return nil, err
	}
	return &GameService{
		ActiveGames:    make(map[string]*t.ActiveGame),
		GameStore:      gStore,
		ChallengeStore: cStore,
	}, nil
}

func CreateRouter(s *GameService) chi.Router {
	r := chi.NewRouter()
	r.Post("/challenges", auth.CheckAuth(s.CreateChallenge))
	r.Get("/challenges", auth.CheckAuth(s.GetChallenges))
	return r
}

func (s *GameService) CreateChallenge(w http.ResponseWriter, r *http.Request) {
	challenge := t.Challenge{}
	api.Parse(r, &challenge)

	challenge.Id = uuid.NewV4().String()
	challenge.Status = t.ChallengeStatusPending

	if err := s.ChallengeStore.Insert(challenge); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	api.WriteJSON(w, http.StatusOK, challenge)
}

func (s *GameService) GetChallenges(w http.ResponseWriter, r *http.Request) {
	currentUser := r.Header.Get("UserId") // refactor to auth helper to pull this from token
	challenges := []*t.Challenge{}

	if err := s.ChallengeStore.Find(m.M{
		"status":     t.ChallengeStatusPending,
		"challengee": currentUser,
	}, nil, &challenges); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	api.WriteJSON(w, http.StatusOK, challenges)
}
