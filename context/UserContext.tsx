import { createContext, useContext, ReactNode } from 'react';

export type User = {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
};

type UserContextType = {
  currentUser: User;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const currentUser: User = {
    id: 'user-1',
    name: 'Juliana Santos',
    avatar: 'https://i.pravatar.cc/100?img=12',
    bio: 'Amante de viagens e novas aventuras',
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
