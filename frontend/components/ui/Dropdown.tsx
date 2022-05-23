import React, { forwardRef, ReactChildren, ReactNode, useState } from "react";
import theme from "../../constants/theme";
import Button from "./Button";
import NBSP from "../utils/NBSP";
import ChevronDown from "../icons/ChevronDown";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Select from "@radix-ui/react-select";
import ChevronRight from "../icons/ChevronRight";
import {
  SelectItemProps,
  SelectLabelProps,
  SelectProps,
} from "@radix-ui/react-select";

// interface Props {
//   items: any[];
//   children: any;
// }
//
// export interface DropdownData {
//   items: {
//     content: JSX.Element | string;
//     onClick: () => void;
//   }[];
// }
//
// const Dropdown = ({
//   data,
//   children,
// }: {
//   data: DropdownData;
//   children: JSX.Element | string;
// }) => {
//   const [visible, setVisible] = useState(false);
//
//   return (
//     <div className="dropdown">
//       <Button onClick={() => setVisible(!visible)}>{children}<ChevronDown style={{ height: "0.8em", marginLeft: "0.5em" }} /></Button>
//       <div className="background" onClick={() => setVisible(false)} />
//       <div className="list" onClick={() => setVisible(false)}>
//         {data.items.map((item, index) => (
//           <Button key={index} onClick={item.onClick}>
//             {item.content}
//           </Button>
//         ))}
//       </div>
//       <style jsx>{`
//         .dropdown {
//           position: relative;
//           height: 2.2rem;
//         }
//
//         .dropdown > :global(.button) {
//           position: relative;
//           z-index: ${visible ? "2" : "unset"};
//           justify-content: space-between;
//         }
//
//         .list {
//           position: relative;
//           visibility: ${visible ? "visible" : "hidden"};
//           height: ${visible ? "auto" : "0"};
//           z-index: 2;
//           background-color: ${theme.lightHighContrast};
//           border: 1px solid ${theme.lightLowContrast};
//           border-radius: 4px;
//           margin-top: 0.5em;
//           flex-direction: column;
//           overflow: hidden;
//         }
//
//         .list > :global(*) {
//           border: none;
//           border-radius: 0;
//           border-bottom: 1px solid ${theme.lightLowContrast};
//         }
//
//         .list > :global(*):last-child {
//           border-bottom: none;
//         }
//
//         .background {
//           z-index: 1;
//           position: fixed;
//           top: 0;
//           left: 0;
//           height: 100vh;
//           width: 100vw;
//           display: ${visible ? "block" : "none"};
//         }
//       `}</style>
//     </div>
//   );
// };

const Root = React.forwardRef(
  ({ children, ...rest }: SelectProps, forwardedRef: React.Ref<any>) => {
    return (
      <Select.Root {...rest}>
        <Select.Trigger
          ref={forwardedRef}
          className="inline-flex items-center gap-2 border border-stone-300 rounded-md px-4 p-0 font-medium text-sm h-10 outline-0 focus:ring ring-offset-1 ring-green-200"
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
      className="cursor-default outline-0 text-sm font-medium px-4 py-1 rounded focus:bg-stone-100 hover:bg-stone-100"
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
