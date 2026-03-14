import VISIT_REASONS from "./ReasonsForVisit";
const normalizeReason = (reason: string): string => {
  const match = VISIT_REASONS.find(
    (r) => r.value === reason || r.label === reason,
  );
  return match?.label ?? reason;
};

export default normalizeReason