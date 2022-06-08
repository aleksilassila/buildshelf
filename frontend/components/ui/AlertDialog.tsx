import * as AlertDialog from "@radix-ui/react-alert-dialog";
import theme from "../../constants/theme";
import { ReactNode } from "react";
import Button from "./Button";

const Root = ({ children }) => {
  return <AlertDialog.Root>{children}</AlertDialog.Root>;
};

const Trigger = ({ children }) => {
  return (
    <AlertDialog.Trigger asChild>
      <div>{children}</div>
    </AlertDialog.Trigger>
  );
};

const Content = ({ children }) => {
  return (
    <AlertDialog.Portal>
      <AlertDialog.Overlay className="fixed inset-0 bg-black opacity-30" />
      <AlertDialog.Content
        className={`${theme.ui.borders} w-1/2 p-4 px-8 bg-stone-50 top-1/2 left-1/2 fixed translate-x-[-50%] translate-y-[-50%]`}
      >
        {children}
      </AlertDialog.Content>
    </AlertDialog.Portal>
  );
};

const Action: ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) => JSX.Element = ({ children, onClick }) => {
  return (
    <AlertDialog.Action asChild>
      <div onClick={onClick}>{children}</div>
    </AlertDialog.Action>
  );
};

const Cancel: ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) => JSX.Element = ({ children, onClick }) => {
  return (
    <AlertDialog.Cancel asChild>
      <div onClick={onClick}>{children}</div>
    </AlertDialog.Cancel>
  );
};

const ConfirmDangerous = ({ onConfirm }) => (
  <div className="flex flex-col gap-6">
    <div>
      <h2 className="text-lg font-medium">Are you sure?</h2>
      <p className="">You cannot undo this action.</p>
    </div>
    <div className="flex gap-4">
      <AlertDialog.Action onClick={onConfirm}>
        <Button mode="primary">Confirm</Button>
      </AlertDialog.Action>
      <AlertDialog.Cancel>
        <Button>Cancel</Button>
      </AlertDialog.Cancel>
    </div>
  </div>
);

export { Root, Cancel, Content, Action, Trigger, ConfirmDangerous };
