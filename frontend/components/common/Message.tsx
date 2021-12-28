import theme from "../../constants/theme";

const Message = ({
  children,
  visible,
  close,
  danger = false,
  success = false,
}) => {
  if (!visible) return null;

  return (
    <div className="message">
      {children}
      <div className="close" onClick={close}>
        x
      </div>
      <style jsx>{`
        .message {
          background-color: ${danger
            ? theme.red
            : success
            ? theme.layout
            : theme.lightHighContrast};
          color: ${danger || success
            ? theme.lightHighContrast
            : theme.darkHighContrast};
          border: 1px solid ${theme.lightMediumContrast};
          border-radius: 4px;
          padding: 0.4em 1em;
          font-size: 0.9em;
          position: relative;
        }

        .close {
          position: absolute;
          top: 0.5em;
          right: 0.5em;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Message;