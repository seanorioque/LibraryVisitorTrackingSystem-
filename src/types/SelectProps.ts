import SelectOption from "./SelectOption";
interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  style?: React.CSSProperties;
}

export default SelectProps
