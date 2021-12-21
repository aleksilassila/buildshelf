const Input = ({
  value,
  setValue,
  placeholder,
  type = "text",
  textArea = false,
}) => {
  return (
    <div>
      {textArea ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          type={type}
        />
      )}
      <style jsx>
        {`
          input,
          textarea {
            font-family: inherit;
          }
        `}
      </style>
    </div>
  );
};

export default Input;
