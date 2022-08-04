import * as RadioGroup from "@radix-ui/react-radio-group";
import { ReactNode } from "react";
import theme from "../../constants/theme";

const Root = ({ children, className, ...rest }: RadioGroup.RadioGroupProps) => (
  <RadioGroup.Root className={`flex flex-col gap-1 ${className}`} {...rest}>
    {children}
  </RadioGroup.Root>
);

interface ItemProps {
  children?: ReactNode;
  value: string;
  className?: string;
}

const Radio = () => (
  <div className="h-4 w-4 rounded-full bg-stone-300 flex justify-center items-center">
    <RadioGroup.Indicator className="h-2 w-2 bg-green-500 rounded-full" />
  </div>
);

const Item = ({ children, value, className, ...rest }: ItemProps) => (
  <RadioGroup.Item
    className={`${theme.ui.borders} ${theme.ui.spacing} bg-white flex items-center gap-2 p-1`}
    value={value}
    {...rest}
  >
    <Radio />
    <div className={`flex-1 flex items-center ${className}`}>{children}</div>
  </RadioGroup.Item>
);

export { Root, Item, Radio };
