// Shared types between frontend and API
export interface User {
  id: string;
  email: string;
  username: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Game {
  id: string;
  title: string;
  provider: string;
  thumbnail: string;
  description: string;
  category: "SLOT" | "LIVE" | "TABLE" | "JACKPOT";
  popularity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Favorite {
  id: string;
  userId: string;
  gameId: string;
  createdAt: Date;
}

export interface GameSession {
  id: string;
  userId: string;
  gameId: string;
  startedAt: Date;
  endedAt: Date | null;
}

export interface AuthResponse {
  user: Omit<User, "password">;
  token: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}
