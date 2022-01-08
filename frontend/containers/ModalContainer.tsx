import CloseIcon from "../components/icons/CloseIcon";
import theme from "../constants/theme";

const ModalContainer = ({ children, close, splash = false }) => (
  <div className="container" onClick={close}>
    <div className="content" onClick={(e) => e.stopPropagation()}>
      {/*<div className="close"><Button onClick={close}>Back</Button></div>*/}
      {children}
      <div className="close" onClick={close}>
        <CloseIcon />
      </div>
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
        ${splash &&
        `
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              `}
      }

      .close {
        cursor: pointer;
        position: absolute;
        top: 0.4em;
        right: 0.5em;
        color: ${theme.lightLowContrast};
        font-size: 1.3em;
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
