import SelectProps from "../types/SelectProps";
import T from "../utils/theme";
export const Select = ({ value, onChange, options, style }: SelectProps) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{
      background: T.elevated,
      border: `1px solid ${T.border}`,
      borderRadius: 8,
      color: T.text,
      padding: "8px 12px",
      fontSize: 13,
      outline: "none",
      cursor: "pointer",
      ...style,
    }}
  >
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);
export default Select