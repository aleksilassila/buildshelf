import { useEffect, useRef, useState } from "react";
import theme from "../../constants/theme";

type ToastMode = "primary" | "danger" | "default";

interface ToastState {
  description: string;
  title: string;
  isOpen: boolean;
  mode: ToastMode;
}

interface ToastProps extends ToastState {
  timeout: number;
  close: () => void;
}

const Toast: ({
  toastProps: props,
}: {
  toastProps: ToastProps;
}) => JSX.Element = ({ toastProps: props }) => {
  const timer = useRef(null);

  useEffect(() => {
    if (props?.isOpen) {
      timer.current = setTimeout(() => {
        props.close();
      }, props?.timeout);
    }

    return () => {
      clearTimeout(timer.current);
    };
  }, [props]);

  return (
    <div
      className={`${
        theme.ui.borders
      } fixed bottom-2 right-2 z-50 flex flex-col items-start p-3 pl-4 pr-12 shadow-md transition-all ${
        {
          default: "bg-white",
          primary: "bg-green-500 text-white",
          danger: "bg-red-500 text-white",
        }[props.mode]
      }`}
      style={{
        opacity: props.isOpen ? 1 : 0,
      }}
    >
      <div className="font-medium text tracking-tight">{props?.title}</div>
      <div
        className={`text-sm ${
          {
            default: "text-stone-600",
            primary: "text-stone-100",
            danger: "text-stone-100",
          }[props.mode]
        }`}
      >
        {props?.description}
      </div>
    </div>
  );
};

const useToast: (
  timeout?: number
) => [
  (title: string, description: string, mode?: ToastMode) => void,
  ToastProps
] = (timeout = 3000) => {
  const [toastProps, setToastProps] = useState<ToastState>({
    isOpen: false,
    title: "",
    description: "",
    mode: "default",
  });

  const open = (
    title: string,
    description: string,
    mode: ToastMode = "default"
  ) => {
    setToastProps({
      ...toastProps,
      title,
      description,
      mode,
      isOpen: true,
    });
  };

  const close = () => {
    setToastProps({
      ...toastProps,
      isOpen: false,
    });
  };

  return [open, { ...toastProps, close, timeout }];
};

export { Toast, useToast };
