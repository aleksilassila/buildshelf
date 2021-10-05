import theme from "../theme";

interface Post {
    title: string,
    description: string,
    buildFile: string,
    images: string[],
    downloads: number,
}

const PostCard = ({ post }) => <div className="card">
    <h3 className="title">{post.title}</h3>
    <span className="description">
        <span>{post.description}</span>
    </span>
    <style jsx>
        {`
            .card {
                background-color: ${theme.lowContrastDark};
                background-image: url("${post.images[0] ? "http://localhost:9000/api/files/" + post.images[0] : "https://peda.net/p/jplahti/css/rtk/b:file/download/94b73913984389ce71d2011110c7bd911c92bfb6/blueprint-4056027_1280.jpg"}");
                background-position: center;
                background-size: cover;
                background-repeat: no-repeat;
                padding: 1em;
                margin: 0.7em 1em;
                border-radius: 4px;
                min-width: 350px;
                min-height: 250px;
                width: auto;
                flex-grow: 1;
                position: relative;
            }
            
            .title {
                display: inline;
                margin-bottom: 0.4em;
                padding: 0.2em;
                background-color: ${theme.lowContrastDark};
                border-radius: 4px;
            }
            
            .description {
                position: absolute;
                padding: 1.2em;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                transition: opacity 0.15s linear;
                backdrop-filter: blur(3px);
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 4px;
                background-color: ${theme.lowContrastDark}80;
                cursor: pointer;
            }
            
            .description:hover {
                opacity: 1;
            }
        `}
    </style>
</div>;

const BuildsList = ({ posts }) => {
    return (
        <div className="builds-list">
            <h3>Popular builds right now</h3>
            <div className="cards-container">
                {
                    posts.map((post: Post, index) => {
                        return <PostCard key={index} post={post} />;
                    })
                }
            </div>
            <style jsx>
                {`
                    .builds-list {
                        padding: 3vh 3vw;
                    }
                    
                    .cards-container {
                        display: flex;
                        flex-direction: row;
                        flex-wrap: wrap;
                        margin: 0 -1em;
                    }
                `}
            </style>
        </div>
    );
}

export default BuildsList;