import CollegeData from "../types/CollegeData";
import Colleges from "../utils/College"
import T from "../utils/theme"
export const collegeData: CollegeData[] = Colleges.map((c, i) => ({
  name: c.replace("College of ", ""),
  visitors: [342, 287, 198, 423, 156, 211, 134, 178][i],
  fill: [
    T.accent,
    T.green,
    T.yellow,
    T.purple,
    T.cyan,
    T.red,
    T.orange,
    T.lightPurple,
  ][i],
}));
export default collegeData; 