export interface User {
  id: number;
  name: string;
  email: string;
  college: string;
  status: "active" | "blocked";
  blockReason: string | null;
  visits: number;
  lastVisit: string;
  registeredAt: string;
}
export default User;