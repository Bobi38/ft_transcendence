import { createContext, useContext, useState } from 'react';

export const FRIEND = {
    START : 0,
    GREEN: 2,
    RED: 1,

};

const FriendContext = createContext(null);

export function FriendProvider({ children }) {
  const [showFriend, setShowFriend] = useState(FRIEND.START);

  return (
    <FriendContext.Provider value={{ showFriend, setShowFriend }}>
      {children}
    </FriendContext.Provider>
  );
}

export const useFriend = () => useContext(FriendContext);