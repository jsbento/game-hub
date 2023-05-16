package service

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jsbento/game-hub/backend/pkg/api"
	m "github.com/jsbento/game-hub/backend/pkg/mongo"
	t "github.com/jsbento/game-hub/backend/users/types"
	uuid "github.com/satori/go.uuid"
)

func (s *UserService) InviteFriend(w http.ResponseWriter, r *http.Request) {
	req := &t.FriendRequest{}
	api.Parse(r, req)

	req.Id = uuid.NewV4().String()

	if err := s.SocialStore.Insert(req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	api.WriteJSON(w, http.StatusOK, req)
}

func (s *UserService) GetFriendInvites(w http.ResponseWriter, r *http.Request) {
	userId := r.Header.Get("UserId") // refactor to auth helper to pull this from token
	if userId == "" {
		http.Error(w, "Invalid user id", http.StatusBadRequest)
		return
	}

	q := m.M{
		"$or": []m.M{
			{"to": userId},
			{"from": userId},
		},
	}

	var invites []*t.FriendRequest
	if err := s.SocialStore.Find(q, nil, &invites); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	incoming := []*t.FriendRequest{}
	outgoing := []*t.FriendRequest{}

	for _, invite := range invites {
		if invite.To == userId {
			incoming = append(incoming, invite)
		} else if invite.From == userId {
			outgoing = append(outgoing, invite)
		}
	}

	resp := map[string][]*t.FriendRequest{
		"outgoing": outgoing,
		"incoming": incoming,
	}

	api.WriteJSON(w, http.StatusOK, resp)
}

func (s *UserService) HandleFriendInvite(w http.ResponseWriter, r *http.Request) {
	currentUserId := r.Header.Get("UserId")
	if currentUserId == "" {
		http.Error(w, "Invalid user id", http.StatusBadRequest)
		return
	}
	fReqId := chi.URLParam(r, "id")
	if fReqId == "" {
		http.Error(w, "Invalid friend request id", http.StatusBadRequest)
		return
	}
	req := &t.HandleInviteReq{}
	api.Parse(r, req)

	if req.Option == "decline" {
		deleted := t.FriendRequest{}
		if err := s.SocialStore.Delete(m.M{"_id": fReqId}, &deleted); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		api.WriteJSON(w, http.StatusOK, deleted)
		return
	}

	fReq := t.FriendRequest{}
	if err := s.SocialStore.FindOne(m.M{"_id": fReqId}, &fReq); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	userIds := []string{fReq.From, fReq.To}
	users := []*t.User{}
	if err := s.UserStore.Find(m.M{"_id": m.M{"$in": userIds}}, nil, &users); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if len(users) != 2 {
		http.Error(w, "Invalid users", http.StatusBadRequest)
		return
	}

	u1, u2 := users[0], users[1]

	u1.Friends = append(u1.Friends, u2.Id)
	u2.Friends = append(u2.Friends, u1.Id)

	if err := s.UserStore.Update(m.M{"_id": u1.Id}, u1, &t.User{}); err != nil {
		log.Printf("Error updating user: %v", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if err := s.UserStore.Update(m.M{"_id": u2.Id}, u2, &t.User{}); err != nil {
		log.Printf("Error updating user: %v", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if err := s.SocialStore.Delete(m.M{"_id": fReqId}, &fReq); err != nil {
		log.Printf("Error deleting friend request: %v", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if u1.Id == currentUserId {
		api.WriteJSON(w, http.StatusOK, u1)
	} else {
		api.WriteJSON(w, http.StatusOK, u2)
	}
}

// TODO: Remove in place of UpdateUser
func (s *UserService) RemoveFriend(w http.ResponseWriter, r *http.Request) {
	currentUserId := r.Header.Get("UserId")
	if currentUserId == "" {
		http.Error(w, "Invalid user id", http.StatusBadRequest)
		return
	}
	friendId := chi.URLParam(r, "id")
	if friendId == "" {
		http.Error(w, "Invalid friend id", http.StatusBadRequest)
		return
	}

	user := t.User{}
	if err := s.UserStore.FindOne(m.M{"_id": currentUserId}, &user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	newFriends := []string{}
	for _, f := range user.Friends {
		if f != friendId {
			newFriends = append(newFriends, f)
		}
	}
	user.Friends = newFriends

	updated := t.User{}
	if err := s.SocialStore.Update(m.M{"_id": currentUserId}, &user, &updated); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	api.WriteJSON(w, http.StatusOK, user)
}
