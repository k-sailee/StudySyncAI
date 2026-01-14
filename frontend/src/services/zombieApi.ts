import axios from "axios";

// Use shared axios base; call zombie endpoints under `/zombie` so global base `/api` + `/zombie` -> `/api/zombie`
const API_PREFIX = "/zombie";

export interface Survivor {
  id: number;
  name: string;
  health: number;
  hunger: number;
  morale: number;
  shelter: number;
  allies: number;
  day: number;
  score: number;
  status: 'alive' | 'dead' | 'escaped';
  createdAt: Date;
  decisions: Decision[];
}

export interface Decision {
  day: number;
  decision: string;
  result: string;
}

export interface LeaderboardEntry {
  id: number;
  name: string;
  score: number;
  days: number;
  survived: boolean;
  timestamp: Date;
}

export type DecisionType = 'shelter' | 'food' | 'allies' | 'rest';

// Create new survivor
export const createSurvivor = async (name: string): Promise<{ survivor: Survivor }> => {
  const { data } = await axios.post(`${API_PREFIX}/survivors`, { name });
  return data;
};

// Make decision
export const makeDecision = async (
  survivorId: number,
  decision: DecisionType
): Promise<{ survivor: Survivor; message: string; scoreGain: number; zombieEvent: boolean }> => {
  const { data } = await axios.post(`${API_PREFIX}/survivors/${survivorId}/decisions`, { decision });
  return data;
};

// Get leaderboard
export const getLeaderboard = async (): Promise<{ leaderboard: LeaderboardEntry[]; total: number }> => {
  const { data } = await axios.get(`${API_PREFIX}/leaderboard`);
  return data;
};

// Add to leaderboard
export const addToLeaderboard = async (entry: {
  name: string;
  score: number;
  days: number;
  survived: boolean;
}): Promise<{ entry: LeaderboardEntry }> => {
  const { data } = await axios.post(`${API_PREFIX}/leaderboard`, entry);
  return data;
};
