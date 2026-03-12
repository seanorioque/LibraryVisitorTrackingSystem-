export const monthlyData = Array.from({ length: 30 }, (_, i) => ({
  date: `Jun ${i + 1}`,
  visitors: Math.floor(Math.random() * 180) + 60,
}));

export default monthlyData;