import CloseIcon from "../icons/CloseIcon";

interface Props {
  children?: any;
  className?: string;
  rest?: any;
}

interface ItemProps extends Props {
  onRemove?: (e) => void;
}

const Root = ({ children, className, ...rest }: Props) => (
  <div className={`grid grid-flow-col gap-2 w-min ${className}`} {...rest}>
    {children}
  </div>
);

const Item = ({ children, className, onRemove, ...rest }: ItemProps) => (
  <div
    className={`flex flex-row items-center rounded-full p-0.5 pr-4
        font-bold whitespace-nowrap text-sm text-green-400
        ${className} border border-green-200 bg-green-100`}
    {...rest}
  >
    <div
      onClick={onRemove}
      className="h-5 w-5 p-0.5 mr-2 bg-green-100 text-green-300 hover:bg-green-200
          hover:text-green-400 rounded-full cursor-pointer flex justify-center
          items-center"
    >
      <CloseIcon />
    </div>
    {children}
  </div>
);

export default { Root, Item };
