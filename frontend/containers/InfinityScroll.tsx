import {useCallback, useEffect, useRef} from "react";

const InfinityScroll = ({ children, fetchMore }) => {
  const loader = useRef(null);

  const handleObserver = useCallback((entities) => {
    if (entities[0].isIntersecting) {
      fetchMore();
    }
  }, [fetchMore]);

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
    <div
      style={{ display: "flex", flex: "1 0 auto", flexDirection: "column" }}
      className="infinity-scroll"
    >
      {children}
      <div className="loader" ref={loader} />
    </div>
  );
};

export default InfinityScroll;
