import PrimaryButton, { ButtonProps } from "./Button";
import { ImageIcon } from "../../icons/ImageIcon";

const LoadingButton = (props: { loading: boolean } & ButtonProps) => (
  <PrimaryButton
    {...props}
    mode={props.loading ? "disabled" : props.mode || undefined}
  >
    <div className={props.loading ? "hidden" : ""}>{props.children}</div>
    <div className={props.loading ? "" : "hidden"}>
      <ImageIcon src="/loading.svg" />
    </div>
  </PrimaryButton>
);

export default LoadingButton;
