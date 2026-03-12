import BtnProps from "../types/BtnProps";
import BtnVariant from "../types/BtnVariant";
import T from "../utils/theme";
export const Btn = ({
  children,
  onClick,
  variant = "primary",
  style,
  disabled,
}: BtnProps) => {
  const colors: Record<
    BtnVariant,
    { bg: string; color: string; border?: string }
  > = {
    primary: { bg: T.accent, color: "#fff" },
    danger: { bg: T.red, color: "#fff" },
    success: { bg: T.green, color: "#fff" },
    ghost: { bg: T.elevated, color: T.text, border: `1px solid ${T.border}` },
  };
  const c = colors[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: c.bg,
        color: c.color,
        border: c.border ?? "none",
        padding: "7px 14px",
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center", 
        gap: 5,
        whiteSpace: "nowrap",
        minWidth: 80, 
        ...style,
      }}
    >
      {children}
    </button>
  );
};
export default Btn;
