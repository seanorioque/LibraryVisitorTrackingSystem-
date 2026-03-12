import Log from "../types/Log";
import Colleges from "../utils/College";
import Reasons from "../utils/Reasons"

const generateLogs = (): Log[] =>
  Array.from({ length: 120 }, (_, i) => {
    const hour = 7 + (i % 13);
    const min = (i * 7) % 60;
    const day = (i % 28) + 1;
    const month = (i % 4) + 3;
    return {
      id: i + 1,
      name:
        [
          "Maria Santos",
          "Juan Dela Cruz",
          "Ana Reyes",
          "Carlo Mendoza",
          "Liza Flores",
          "Marco Bautista",
          "Claire Garcia",
          "Ralph Torres",
        ][i % 8] + ` ${(i % 15) + 1}`,
      email: `student${(i % 48) + 1}@neu.edu.ph`,
      college: Colleges[i % Colleges.length],
      reason: Reasons[i % Reasons.length],
      date: `2025-0${month}-${String(day).padStart(2, "0")}`,
      time: `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`,
      valid: i % 9 !== 0,
    };
  });

  export default generateLogs