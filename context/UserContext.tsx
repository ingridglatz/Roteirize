import { createContext, useContext, ReactNode } from 'react';

export type User = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  verified?: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  following: string[];
  followers: string[];
  blocked: string[];
};

type UserContextType = {
  currentUser: User;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const currentUser: User = {
    id: 'user-1',
    name: 'Juliana Santos',
    username: 'juliana.santos',
    avatar: 'https://i.pravatar.cc/100?img=12',
    bio: 'Amante de viagens e novas aventuras 🌎✈️',
    verified: true,
    followersCount: 1542,
    followingCount: 432,
    postsCount: 87,
    following: ['user-2', 'user-3', 'user-5'],
    followers: ['user-2', 'user-3', 'user-4', 'user-5', 'user-6'],
    blocked: [],
  };

  return (
    <UserContext.Provider value={{ currentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
