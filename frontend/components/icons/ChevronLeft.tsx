import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const ChevronLeft = ({ ...rest }) => (
  <FontAwesomeIcon {...rest} icon={faChevronLeft} />
);

export default ChevronLeft;
