const TitleSubtitlePicture = ({ picture, subtitle, title }) => {
  return (
    <div className="title-subtitle-picture">
      {picture}
      <div className="content">
        <h2>{title}</h2>
        {subtitle}
      </div>
      <style jsx>{`
        .title-subtitle-picture {
          display: flex;
        }

        .title-subtitle-picture > :global(img) {
          height: 4em;
          margin-right: 1em;
        }

        .content {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default TitleSubtitlePicture;
