export type FriendRequest = {
    id: string;
    to: string;
    from: string;
}

export type CategoryFriendRequest = {
  incoming: FriendRequest[];
  outgoing: FriendRequest[];
}