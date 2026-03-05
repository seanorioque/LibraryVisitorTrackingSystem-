import BtnVariant from "./BtnVariant";

interface BtnProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  variant?: BtnVariant;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export default BtnProps