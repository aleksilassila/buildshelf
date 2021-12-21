interface Props {
  images: string[];
}

const ImageCollection = ({ images }: Props) => {
  return (
    <div className="container">
      <div className="images-container">
        {images.map((url, key) => (
          <img src={process.env.BACKEND_ENDPOINT + "/files/" + url} key={key} />
        ))}
      </div>
      <style jsx>
        {`
          .images-container {
            display: flex;
            flex-direction: row;
            overflow: scroll;
            flex-wrap: nowrap;
          }

          img {
            max-height: 350px;
            border-radius: 4px;
          }

          .images-container > img {
            margin-right: 2em;
          }

          .images-container > img:last-child {
            margin-right: 0;
          }

          ::-webkit-scrollbar {
            width: 0;
            display: none;
          }
        `}
      </style>
    </div>
  );
};

export default ImageCollection;
