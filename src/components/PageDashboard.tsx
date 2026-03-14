export const PageDashboard = ({
  setPage,
}: {
  liveCount: number;
  setPage: (p: PageId) => void;
}) => {
  const db = getFirestore();


  export const [visits, setVisits] = useState<Visit[]>([]);
  export const [todayTotal, setTodayTotal] = useState(0);
  export const [weekTotal, setWeekTotal] = useState(0);
export  const [monthTotal, setMonthTotal] = useState(0);
 export  const [weeklyData, setWeeklyData] = useState<WeeklyEntry[]>([]);
export  const [collegeData, setCollegeData] = useState<CollegeEntry[]>([]);
 export const [hourlyData, setHourlyData] = useState<HourlyEntry[]>([]);
 export const [reasonData, setReasonData] = useState<ReasonEntry[]>([]);
export  const [blockedCount, setBlockedCount] = useState(0);