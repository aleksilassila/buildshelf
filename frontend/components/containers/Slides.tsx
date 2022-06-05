import React, { useState } from "react";
import Button from "../ui/Button";
import ChevronRight from "../icons/ChevronRight";
import ChevronLeft from "../icons/ChevronLeft";

interface Props {
  children: React.ReactNode[];
  className?: string;
  cols?: number;
}

/*
FIXME: add count indicator
 */

const Container = ({ children, className, cols = 2, ...rest }: Props) => {
  const [scrollIndex, setScrollIndex] = useState(0);

  const onClickPrevious = (e) => {
    e.preventDefault();
    setScrollIndex(scrollIndex <= 0 ? children.length - 1 : scrollIndex - 1);
  };

  const onClickNext = (e) => {
    e.preventDefault();
    setScrollIndex(scrollIndex >= children.length - 1 ? 0 : scrollIndex + 1);
  };

  if (children.length === 1) {
    return (
      <div className={`grid overflow-hidden ${className}`} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-x-hidden w-full h-48 max-h-full overflow-hidden ${className}`}
      {...rest}
    >
      <div className="group absolute top-0 right-0 left-0 bottom-0 z-10 flex justify-between items-center">
        <ChevronLeft
          className="text-white cursor-pointer h-full px-4 box-content bg-gradient-to-r from-[#00000044] to-[#00000000] opacity-0 group-hover:opacity-100"
          onClick={onClickPrevious}
        />
        <ChevronRight
          className="text-white cursor-pointer h-full px-4 box-content bg-gradient-to-l from-[#00000044] to-[#00000000] opacity-0 group-hover:opacity-100"
          onClick={onClickNext}
        />
      </div>
      <div
        className={`grid grid-flow-col grid-rows-1 h-full gap-3 transition-all`}
        style={{
          gridTemplateColumns: `repeat(${children?.length}, ${
            cols > 1 ? "calc(50% - 0.375rem)" : "100%"
          })`,
          transform:
            cols > 1
              ? `translateX(calc(${scrollIndex * -50}% - ${
                  scrollIndex * 0.375
                }rem))`
              : `translateX(calc(${scrollIndex * -100}% - ${
                  scrollIndex * 0.75
                }rem))`,
        }}
        {...rest}
      >
        {children}
      </div>
    </div>
  );
};

const Picture = ({ uri, url }: { uri?: string; url?: string }) => (
  <div
    className="bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: uri
        ? `url("${process.env.BACKEND_ENDPOINT + "/files/" + uri}")`
        : `url("${url}")`,
    }}
  />
);

export { Container, Picture };
