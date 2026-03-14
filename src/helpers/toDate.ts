import Visit from "../types/Visit";
const toDate = (ts: Visit["timestamp"]): Date =>
  ts instanceof Date
    ? ts
    : new Date((ts as { seconds: number }).seconds * 1000);

export default toDate;
