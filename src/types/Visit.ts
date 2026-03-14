interface Visit {
  uid: string;
  name: string;
  email: string;
  reason: string;
  college: string;
  timestamp: { seconds: number; nanoseconds: number } | Date;
}
export default Visit; 