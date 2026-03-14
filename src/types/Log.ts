interface Log {
  id: string;
  uid: string;
  name: string;
  email: string;
  college: string;
  studentId: string;
  reason: string;
  date: string;
  time: string;
  timestamp: { seconds: number } | Date;
}

export default Log;