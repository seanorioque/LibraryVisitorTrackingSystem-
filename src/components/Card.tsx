import T from "../utils/theme";
export const Card = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      padding: 20,
      overflow: "hidden", 
      ...style,
    }}
  >
    {children}
  </div>
);
export default Card;