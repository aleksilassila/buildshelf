import React from "react";
import ChevronDown from "../icons/ChevronDown";
import * as Select from "@radix-ui/react-select";
import {
  SelectItemProps,
  SelectLabelProps,
  SelectProps,
} from "@radix-ui/react-select";
import theme from "../../constants/theme";

const Root = React.forwardRef(
  ({ children, ...rest }: SelectProps, forwardedRef: React.Ref<any>) => {
    return (
      <Select.Root {...rest}>
        <Select.Trigger
          ref={forwardedRef}
          className={`${theme.ui.spacing} ${theme.ui.borders} ${theme.ui.outline} gap-2 font-medium bg-white`}
        >
          <Select.Value />
          <Select.Icon asChild>
            <ChevronDown className="h-3" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Content>
          <Select.Viewport className="bg-white outline outline-1 outline-stone-300 shadow-xl rounded-md px-1 py-2">
            {children}
          </Select.Viewport>
        </Select.Content>
      </Select.Root>
    );
  }
);

const Item = React.forwardRef(
  (
    { children, value, ...rest }: SelectItemProps,
    forwardedRef: React.Ref<any>
  ) => (
    <Select.Item
      value={value}
      {...rest}
      ref={forwardedRef}
      className="cursor-default outline-0 font-medium px-4 py-1 rounded focus:bg-stone-100 hover:bg-stone-100"
    >
      <Select.ItemIndicator>
        {/*<ChevronRight className="h-2" />*/}
      </Select.ItemIndicator>
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  )
);

const Label = React.forwardRef(
  ({ children, ...rest }: SelectLabelProps, forwardedRef: React.Ref<any>) => (
    <Select.Label
      ref={forwardedRef}
      {...rest}
      className="text-xs font-semibold text-stone-500 px-2 mx-2 my-1 py-1 border-stone-200 tracking-wide"
    >
      {children}
    </Select.Label>
  )
);

const Group = React.forwardRef(
  ({ children, ...rest }: SelectLabelProps, forwardedRef: React.Ref<any>) => (
    <Select.Group ref={forwardedRef} {...rest}>
      {children}
    </Select.Group>
  )
);

export { Root, Item, Label, Group };
