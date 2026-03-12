
import SelectOption from "./SelectOption";
interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  style?: React.CSSProperties;
}
export default SelectProps;