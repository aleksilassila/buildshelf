import { useEffect, useRef } from "react";

const InfiniteScroll = ({ children, page, setPage }) => {
  const loader = useRef(null);

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

  const handleObserver = (entities) => {
    if (entities[0].isIntersecting) {
      setPage(page + 1);
    }
  };

  return (
    <div>
      {children}
      <div className="loader" ref={loader} />
    </div>
  );
};

export default InfiniteScroll;
