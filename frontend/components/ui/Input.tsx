import theme from "../../constants/theme";
import {useRef} from "react";

interface Props {
  value: string;
  setValue: (string) => void;
  placeholder: string;
  onEnter?: (e) => void | null;
  height?: string;
  type?: string;
  textArea?: boolean;
  onBlur?: () => void;
  children?: JSX.Element;
  id?: string;
  className?: string;
}

const Input = ({
  value,
  setValue,
  placeholder,
  onEnter = null,
  height = "2.2rem",
  type = "text",
  textArea = false,
  onBlur = () => {},
  children,
  id,
  className,
  ...rest
}: Props) => {
  const focusRef = useRef(null);

  const handleEnterKeyDown = (e) => {
    if (e.key === "Enter") {
      if (onEnter) {
        onEnter(e);
      } else {
        e.preventDefault();
      }
    }
  };

  return (
    <div
      className={`input ${theme.ui.outline} ${theme.ui.borders} ${
        theme.ui.spacing
      } w-full ${
        textArea && "h-min"
      } px-0 pl-4 cursor-text bg-white ${className}`}
      onClick={() => focusRef.current.focus()}
      {...rest}
    >
      {children}
      {textArea ? (
        <textarea
          id={id}
          value={value}
          defaultValue={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          onBlur={onBlur}
          ref={focusRef}
          className="min-h-[2.5rem]"
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          type={type}
          onKeyDown={handleEnterKeyDown}
          onBlur={onBlur}
          ref={focusRef}
        />
      )}
      <style jsx>
        {`
          input,
          textarea {
            outline: none;
            border: none;
            background-color: #00000000;
            font-family: inherit;
            resize: vertical;
            flex: 1 1 auto;
            padding: 0.4em 1em 0.4em 0;
          }

          textarea {
            height: ${height};
          }

          .input,
          .input > :global(*) {
            font-weight: 400;
            font-size: 0.96rem;
            color: ${theme.darkLowContrast};
          }

          .input > :global(*):not(:last-child) {
            margin-right: 0.5rem;
          }
        `}
      </style>
    </div>
  );
};

export default Input;
