interface Props {
    images: string[]
}

const ImageCollection = ({ images }: Props) => {
    return <div className="container">
        <div className="images-container">
            {
                images.map((url, key) =>
                    <img src={process.env.BACKEND_ENDPOINT + "/files/" + url} key={key} />)
            }
        </div>
        <style jsx>
            {`
                .images-container {
                    display: flex;
                    flex-direction: row;
                    overflow: scroll;
                    flex-wrap: nowrap;
                    margin: 0 -1em;
                }
                
                img {
                    max-height: 350px;
                    border-radius: 4px;
                    margin: 1em;
                }
                
                ::-webkit-scrollbar {
                    width: 0;
                }
            `}
        </style>
    </div>;
}

export default ImageCollection;
