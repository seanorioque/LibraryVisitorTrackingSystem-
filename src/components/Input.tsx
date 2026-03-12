
import InputProps from "../types/InputProps";
import T from "../utils/theme"
export const Input = ({ placeholder, value, onChange, style }: InputProps) => (
  <input
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    style={{
      background: T.elevated,
      border: `1px solid ${T.border}`,
      borderRadius: 8,
      color: T.textHi,
      padding: "8px 12px",
      fontSize: 13,
      outline: "none",
      ...style,
    }}
  />
);
export default Input;