import T from "../utils/theme"
export const TD = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <td
    style={{
      padding: "10px 12px",
      color: T.text,
      verticalAlign: "middle",
      ...style,
    }}
  >
    {children}
  </td>
);
export default TD;