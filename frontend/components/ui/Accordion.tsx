import * as Accordion from "@radix-ui/react-accordion";
import { CSSProperties, ReactNode } from "react";
import theme from "../../constants/theme";
import ChevronDown from "../icons/ChevronDown";

const padding = "px-4 py-2";

export interface AccordionRootProps {
  type?: "single" | "multiple";
  children?: any;
  className?: string;
  defaultValue?: string;
  [key: string]: any;
}

const Root = ({
  children,
  type = "single",
  className = "",
  ...rest
}: AccordionRootProps) => (
  // @ts-ignore
  <Accordion.Root
    className={`${theme.ui.borders} overflow-hidden bg-white divide-y divide-stone-300 ${className}`}
    type={type}
    {...rest}
  >
    {children}
  </Accordion.Root>
);

interface ItemProps {
  value: string;
  children?: ReactNode[];
  className?: string;
}

const Item = ({ children, value, className }: ItemProps) => (
  <Accordion.Item className={`${className}`} value={value}>
    {children}
  </Accordion.Item>
);

interface ContentProps {
  children?: ReactNode[] | ReactNode;
  className?: string;
}

const Content = ({ children, className }: ContentProps) => (
  <Accordion.Content
    className={`${padding} bg-stone-100 border-t border-stone-300
    
    overflow-hidden ${className}`}
  >
    {children}
  </Accordion.Content>
);

interface TriggerProps {
  children?: any;
  className?: string;
  [key: string]: any;
  style?: CSSProperties;
}

const Trigger = ({ children, className, style, ...rest }: TriggerProps) => (
  <Accordion.Header {...rest}>
    <Accordion.Trigger
      className={`flex items-center justify-between w-full font-medium text-stone-700 ${padding} ${className}`}
      style={style}
    >
      {children}
      <ChevronDown className="h-3" />
    </Accordion.Trigger>
  </Accordion.Header>
);

export { Root, Item, Content, Trigger };
