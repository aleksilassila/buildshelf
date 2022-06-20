import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExternalLinkAlt} from "@fortawesome/free-solid-svg-icons";

const ExternalLink = ({ ...rest }) => (
  <FontAwesomeIcon {...rest} icon={faExternalLinkAlt} />
);

export default ExternalLink;
