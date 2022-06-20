import Button from "./Button";
import {useRef} from "react";

interface Props {
  files: any;
  setFiles: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
}

const FileSelect = ({
  files,
  setFiles,
  className,
  accept = undefined,
  multiple = false,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileDescription = (files): string => {
    if (!files || files?.length === 0) {
      return "Select File" + (multiple ? "s" : "");
    } else if (files?.length) {
      return files.length > 1
        ? files.length + " files selected"
        : "1 file selected";
    } else {
      return files?.name;
    }
  };

  return (
    <Button onClick={() => inputRef.current.click()} className={className}>
      {fileDescription(files)}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple={multiple}
        accept={accept}
        onChange={(e) => setFiles(e.target.files)}
      />
    </Button>
  );
};

export default FileSelect;
