import Log from "../types/Log";
import Visit from "../types/Visit";
export const toDateLog = (ts: Log["timestamp"]): Date =>
  ts instanceof Date
    ? ts
    : new Date((ts as { seconds: number }).seconds * 1000);



export const toDateVisit = (ts: Visit["timestamp"]): Date =>
  ts instanceof Date ? ts : new Date((ts as { seconds: number }).seconds * 1000);