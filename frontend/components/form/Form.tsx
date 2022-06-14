import * as LabelPrimitive from "@radix-ui/react-label";
import Styled from "../Styled";

const Root = ({ children }) => (
  <div className="page-container">
    <form
      onSubmit={(e) => e.preventDefault()}
      className="rounded border border-stone-200 bg-stone-100 shadow grid grid-cols-1 divide-y divide-stone-200 m-6 md:mx-auto md:max-w-screen-md xl:max-w-screen-lg"
    >
      {children}
    </form>
  </div>
);

const Section = Styled("py-4 mx-6");

const Label = ({
  children,
  htmlFor,
  className,
}: {
  children: any;
  htmlFor?: string;
  className?: string;
}) => (
  <LabelPrimitive.Root htmlFor={htmlFor} className={`${className}`}>
    {children}
  </LabelPrimitive.Root>
);

const Tip = Styled("text-xs text-stone-700 mt-2");
const LabelText = Styled("font-medium mb-2");

export { Root, Label, Tip, LabelText, Section };
