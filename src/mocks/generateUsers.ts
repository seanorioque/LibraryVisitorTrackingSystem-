import Colleges from "../utils/College"
import User from "../types/User"
const generateUsers = (): User[] =>
  Array.from({ length: 48 }, (_, i) => ({
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
        "Jenny Villanueva",
        "Kevin Aquino",
        "Patricia Lopez",
        "Ryan Cruz",
        "Michelle Tan",
        "Joseph Lim",
        "Stephanie Ocampo",
        "Brian Fernandez",
        "Kristine Ramos",
        "Daniel Castro",
        "Maricel Espinosa",
        "Paul Navarro",
      ][i % 20] + ` ${i + 1}`,
    email: `student${i + 1}@neu.edu.ph`,
    college: Colleges[i % Colleges.length],
    status: i % 7 === 0 ? "blocked" : "active",
    blockReason:
      i % 7 === 0
        ? [
            "Unauthorized access attempt",
            "Disruptive behavior",
            "Overdue materials",
            "Tailgating",
          ][i % 4]
        : null,
    visits: Math.floor(Math.random() * 80) + 5,
    lastVisit: `2025-0${(i % 3) + 6}-${String((i % 28) + 1).padStart(2, "0")}`,
    registeredAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`,
  }));

  export default generateUsers;