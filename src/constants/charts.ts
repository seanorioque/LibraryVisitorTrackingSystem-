
import T from "../utils/theme"

export const PIE_COLORS = [
  T.accent,
  T.green,
  T.yellow,
  T.purple,
  T.cyan,
  T.red,
  T.orange,
  T.lightPurple,
];

export const hourlyData = Array.from({ length: 13 }, (_, i) => ({
  hour: `${7 + i}:00`,
  count: [12, 28, 45, 67, 89, 102, 98, 87, 74, 56, 42, 31, 18][i],
}));