import * as Accordion from "../ui/Accordion";
import * as RadioGroup from "@radix-ui/react-radio-group";
import {ReactNode} from "react";
import styled from "../Styled";
import {Radio} from "./RadioGroup";

const Root = ({
  children,
  type = "single",
  defaultValue,
  className = "",
  ...rest
}) => (
  <RadioGroup.Root defaultValue={defaultValue}>
    <Accordion.Root
      className={`${className}`}
      defaultValue={defaultValue}
      {...rest}
    >
      {children}
    </Accordion.Root>
  </RadioGroup.Root>
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

const Content = Accordion.Content;

const Trigger = ({ children, value }) => (
  <RadioGroup.Item asChild value={value}>
    <Accordion.Trigger asChild>
      <div className="flex items-center gap-2">
        <Radio />
        {children}
      </div>
    </Accordion.Trigger>
  </RadioGroup.Item>
);

const Section = styled("flex items-center gap-2 my-2");

export { Root, Item, Content, Trigger, Section };
