export interface User {
  id: string;        // ← was number, now string (Firestore doc ID)
  uid: string;
  name: string;
  email: string;
  college: string;
  role: string;
  status: "active" | "blocked";
  blockReason: string | null;
  visits?: number;       
  lastVisit?: string;    
  registeredAt?: string; 
  createdAt?: { seconds: number } | Date;
}

export default User;