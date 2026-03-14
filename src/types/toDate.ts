import Log from "./Log"
const toDate = (ts: Log["timestamp"]): Date =>
  ts instanceof Date
    ? ts
    : new Date((ts as { seconds: number }).seconds * 1000);

    export default toDate;