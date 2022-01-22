import CloseIcon from "../components/icons/CloseIcon";
import theme from "../constants/theme";
import ExternalLink from "../components/icons/ExternalLink";
import Link from "next/link";

const ModalContainer = ({
  children,
  close,
  externalUrl = null,
  splash = false,
}) => (
  <div className="container" onClick={close}>
    <div className="content" onClick={(e) => e.stopPropagation()}>
      {/*<div className="close"><Button onClick={close}>Back</Button></div>*/}
      {children}
      <div className="close" onClick={close}>
        <CloseIcon />
      </div>
      {!!externalUrl ? (
        <div className="openInNewTab">
          <Link href={externalUrl}>
            <a><ExternalLink /></a>
          </Link>
        </div>
      ) : null}
    </div>
    <style jsx>{`
      .container {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 5;
        height: 100vh;
        width: 100vw;
        background-color: #00000080;
      }

      .content {
        height: calc(100vh - 3em);
        width: 90vw;
        background-color: ${theme.lightHighContrast}dd;
        margin: 1.5em 5vw;
        padding: 2em;
        border-radius: 4px;
        backdrop-filter: blur(3px);
        overflow: scroll;
        display: flex;
        flex-direction: column;
      }

      .close {
        cursor: pointer;
        position: absolute;
        top: 0.4rem;
        right: 0.8rem;
        color: ${theme.lightLowContrast};
        font-size: 1.3rem;
      }

      .openInNewTab {
        cursor: pointer;
        position: absolute;
        top: 0.5rem;
        right: 2.4rem;
        color: ${theme.lightLowContrast};
        font-size: 1.1rem;
      }

      @media screen and (max-width: 900px) {
        .content {
          height: 100vh;
          width: 100vw;
          margin: 0;
          border-radius: 0;
        }
      }
    `}</style>
  </div>
);

export default ModalContainer;
