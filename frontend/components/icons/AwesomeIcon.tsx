import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from "@fortawesome/free-solid-svg-icons";

const Icon = ({ icon, ...rest }) => (
  <FontAwesomeIcon {...rest} icon={icons[icon]} />
);
export default Icon;
