export interface User {
  id: string;        // ← was number, now string (Firestore doc ID)
  uid: string;
  name: string;
  email: string;
  college: string;
  role: string;
  status: "active" | "blocked";
  blockReason: string | null;
  visits?: number;       // ← optional, derived from visits collection
  lastVisit?: string;    // ← optional, derived from visits collection
  registeredAt?: string; // ← optional
  createdAt?: { seconds: number } | Date;
}

export default User;