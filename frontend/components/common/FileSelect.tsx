import MultipleButton from "./MultipleButton";

interface Props {
  files: FileList;
  setFiles: (files: FileList) => void;
  multiple?: boolean;
}

const FileSelect = ({ files, setFiles, multiple = false }: Props) => {
  const fileDescription = (files): string => {
    if (!files) {
      return "No files selected";
    }
    else if (files?.length) {
      return files.length > 1 ? files.length + " files selected" : "1 file selected";
    } else {
      return files?.name;
    }
  }

  return (
    <div>
      <MultipleButton inactive={0}>
        {/*<span>{files?.item(0)?.name}</span>*/}
        <span>{fileDescription(files)}</span>
        <label>
          {multiple ? "Upload files" : "Upload a file"}
          <input
            type="file"
            onChange={(e) => setFiles(e.target.files)}
            multiple={multiple}
          />
        </label>
      </MultipleButton>
      <style jsx>
        {`
          input {
            display: none;
          }

          label {
            display: inline-block;
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
};

export default FileSelect;
