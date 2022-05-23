import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const ChevronDown = ({ ...rest }) => (
  <FontAwesomeIcon {...rest} icon={faChevronDown} />
);

export default ChevronDown;
