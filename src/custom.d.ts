declare module '*.js';
declare module '*.jsx';
declare module 'papaparse';
declare module '../../firebase' {
  import { Firestore, FirebaseApp } from 'firebase/firestore';
  export const db: Firestore;
  export const app: FirebaseApp;
}
