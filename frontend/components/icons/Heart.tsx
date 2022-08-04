import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const Heart = ({ style = {} }) => (
  <FontAwesomeIcon style={style} icon={faHeart} />
);

export default Heart;
