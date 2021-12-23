import MultipleButton, { MultipleButtonData } from "./MultipleButton";

interface Props {
  files: any;
  setFiles: (files: FileList) => void;
  multiple?: boolean;
}

const FileSelect = ({ files, setFiles, multiple = false }: Props) => {
  const fileDescription = (files): string => {
    if (!files || files?.length === 0) {
      return "No files selected";
    } else if (files?.length) {
      return files.length > 1
        ? files.length + " files selected"
        : "1 file selected";
    } else {
      return files?.name;
    }
  };

  const multipleButtonData: MultipleButtonData[] = [
    {
      content: <span>{fileDescription(files)}</span>,
      active: true,
    },
    {
      content: (
        <label>
          {multiple ? "Select files" : "Select a file"}
          <input
            type="file"
            onChange={(e) => setFiles(e.target.files)}
            multiple={multiple}
          />
          <style jsx>
            {`
              input {
                display: none;
              }

              label {
              display: inline-block;
                cursor: pointer;
                margin: -0.4em -1em;
                padding: 0.4em 1em;
              }
            `}
          </style>
        </label>
      ),
    },
  ];

  return (
    <div className="file-select">
      <MultipleButton data={multipleButtonData} />
    </div>
  );
};

export default FileSelect;
