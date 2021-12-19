const Heart = ({ color, height }) => {
    return <i className="icon">
        <style jsx>{`
          i.icon {
            height: ${height}em;
            width: ${height + 0.2}em;
            mask-repeat: no-repeat;
            mask-position: center;
            mask-size: auto;
            mask-image: url("/heart.svg");
            background-color: ${color};
          }
        `}</style>
    </i>
}

export default Heart;