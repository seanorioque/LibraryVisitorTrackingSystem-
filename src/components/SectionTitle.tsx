import T from "../utils/theme"
export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      color: T.textHi,
      fontSize: 16,
      fontWeight: 700,
      marginBottom: 16,
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}
  >
    {children}
  </div>
);
export default T;