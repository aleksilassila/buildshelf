import AwesomeIcon from "../../icons/AwesomeIcon";
import { Button, ButtonProps } from "./Button";
import theme from "../../../constants/theme";

const IconButton = (props: { icon: string } & ButtonProps) => (
  <Button
    {...props}
    className={`cursor-pointer flex items-center justify-center w-10 h-10 active:bg-stone-200 text-stone-700 ${theme.ui.borders} ${theme.ui.outline} ${props.className}`}
  >
    <AwesomeIcon icon={props.icon} />
  </Button>
);

export default IconButton;
