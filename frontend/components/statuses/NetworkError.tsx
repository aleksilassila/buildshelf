import theme from "../../constants/theme";
import Status from "./Status";

const NetworkError = () => {
  return (
    <Status>
      <h2>Something went wrong!</h2>
      <p>Could not fetch the content.</p>
      <style jsx>{`
        h2,
        p {
          color: ${theme.red};
        }
      `}</style>
    </Status>
  );
};

export default NetworkError;
