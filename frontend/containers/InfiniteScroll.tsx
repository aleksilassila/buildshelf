import { useEffect, useRef } from "react";

const InfiniteScroll = ({ children, page, incrementPage }) => {
  const loader = useRef(null);

  const handleObserver = (entities) => {
    if (entities[0].isIntersecting) {
      incrementPage();
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    });

    if (loader.current) {
      observer.observe(loader.current);
    }
  }, []);

  return (
    <div>
      {children}
      <div className="loader" ref={loader} />
    </div>
  );
};

export default InfiniteScroll;
