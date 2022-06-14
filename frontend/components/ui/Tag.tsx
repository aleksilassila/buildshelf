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
        font-bold whitespace-nowrap text-sm text-stone-600
        ${className} border border-stone-300 bg-white`}
    {...rest}
  >
    <div
      onClick={onRemove}
      className="h-5 w-5 p-0.5 mr-2 text-stone-600 hover:bg-stone-300
          hover:text-stone-700 rounded-full cursor-pointer flex justify-center
          items-center"
    >
      <CloseIcon />
    </div>
    {children}
  </div>
);

export default { Root, Item };
