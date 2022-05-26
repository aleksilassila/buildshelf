import { useEffect, useRef, useState } from "react";
import theme from "../../constants/theme";

const Toast = ({ toastProps: props }) => {
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
      className={`fixed bottom-2 right-2 z-50 ${theme.ui.borders} bg-white flex flex-col items-start p-3 pl-4 pr-12 shadow-md transition-all`}
      style={{
        opacity: props.isOpen ? 1 : 0,
      }}
    >
      <div className="font-medium text tracking-tight">{props?.title}</div>
      <div className="text-sm text-stone-600">{props?.description}</div>
    </div>
  );
};

const useToast: (timeout?: number) => [
  (title: string, description: string) => void,
  {
    isOpen: boolean;
    description: string;
    title: string;
    close: () => void;
    timeout: number;
  }
] = (timeout = 3000) => {
  const [toastProps, setToastProps] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
  }>({
    isOpen: false,
    title: "",
    description: "",
  });

  const open = (title: string, description: string) => {
    setToastProps({
      ...toastProps,
      title,
      description,
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
