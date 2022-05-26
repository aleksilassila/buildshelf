import Markdown from "../Markdown";
import Input from "../ui/Input";

const FormMarkdownEditor = ({ value, setValue, placeholder }) => (
  <div className="flex flex-wrap h-fit gap-2">
    <Input
      value={value}
      setValue={setValue}
      placeholder={placeholder}
      height="8rem"
      textArea
      className="flex-auto lg:flex-1"
    />
    {!!value ? (
      <Markdown className="bg-stone-50 p-2 px-4 rounded border border-stone-200 flex-auto lg:flex-1 min-h-fit">
        {value}
      </Markdown>
    ) : null}
  </div>
);

export default FormMarkdownEditor;
