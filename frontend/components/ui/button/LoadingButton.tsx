import PrimaryButton, { ButtonProps } from "./Button";
import { ImageIcon } from "../../icons/ImageIcon";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { apiRequest } from "../../../utils/api";
import { useState } from "react";

interface LoadingButtonProps extends ButtonProps {
  axiosConfig?: AxiosRequestConfig;
  onResponse?: (response: AxiosResponse) => void;
}

const LoadingButton = (props: LoadingButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = () => {
    props.onClick && props.onClick();

    if (props.axiosConfig && props.onResponse) {
      setIsLoading(true);
      apiRequest(props.axiosConfig).then((res) => {
        setIsLoading(false);
        props.onResponse(res);
      });
    }
  };

  return (
    <PrimaryButton
      {...props}
      onClick={onClick}
      mode={isLoading ? "disabled" : props.mode || undefined}
    >
      <div className={isLoading ? "hidden" : ""}>{props.children}</div>
      <div className={isLoading ? "" : "hidden"}>
        <ImageIcon src="/loading.svg" />
      </div>
    </PrimaryButton>
  );
};

export default LoadingButton;
