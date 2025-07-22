export interface Passenger {
  pclass: number;
  survived: number;
  name: string;
  sex: 'male' | 'female';
  age: number | null;
  sibsp: number;
  parch: number;
  ticket: number | string;
  fare: number;
  cabin: string | null;
  embarked: 'C' | 'Q' | 'S' | string;
  boat: number | string | null;
  body: number | null;
  'home.dest': string | null;
}

export interface SexCountModel {
  survived: { male: number; female: number };
  notSurvived: { male: number; female: number };
}

export interface StatsModel {
  total: number;
  survivors: number;
  deaths: number;
  survivalRate: number;
  sexCount: SexCountModel;
  classCount: { 1: number; 2: number; 3: number };
}

export type ChartData = {
  labels: string[];
  datasets: { label: string; data: number[]; backgroundColor: string[] }[];
};

export type CommentModel = {
  id: string;
  type: string;
  text: string;
  createdAt?: any;
};