import Reasons from "../utils/Reasons";


export const reasonData = Reasons.map((r, i) => ({
  name: r,
  value: [312, 248, 189, 167, 143, 201, 88, 134][i],
}));

export default reasonData;