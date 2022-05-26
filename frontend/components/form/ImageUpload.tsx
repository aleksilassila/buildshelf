import Button from "../ui/Button";
import { createRef, useState } from "react";
import { apiRequest } from "../../utils/api";
import ImageCollection from "../ImageCollection";
import { Image } from "../../interfaces/ApiResponses";
import { AxiosResponse } from "axios";
import { Toast, useToast } from "../ui/toast";

const ImageUpload: ({
  uploadCallback,
  initialImages,
}: {
  uploadCallback?: (res: AxiosResponse, allRemoteImages: Image[]) => void;
  initialImages?: Image[];
}) => JSX.Element = ({ uploadCallback = (res) => {}, initialImages = [] }) => {
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [remoteImages, setRemoteImages] = useState<Image[]>(initialImages);
  const [toast, toastProps] = useToast();

  const inputRef = createRef<HTMLInputElement>();

  const upload = (e) => {
    e.preventDefault();

    if (localFiles) {
      const data = new FormData();

      for (const image of localFiles) {
        data.append("images", image);
      }

      apiRequest({
        method: "POST",
        url: "/images/upload",
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          toast("Images Added", "Images added successfully.");
          setRemoteImages([...remoteImages, ...res.data]);

          uploadCallback(res, [...remoteImages, ...res.data]);
        })
        .catch((err) => {
          toast("File Size", "The file is larger than 15 MB");
          uploadCallback(err, remoteImages);
        })
        .finally(() => setLocalFiles([]));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {remoteImages.length ? (
        <ImageCollection
          images={remoteImages}
          remove={(id: number) =>
            setRemoteImages(remoteImages.filter((i) => (i.id != id ? i : null)))
          }
        />
      ) : null}
      <div className="flex gap-2">
        <Button
          onClick={(e) => {
            inputRef.current.click();
          }}
        >
          {localFiles.length
            ? `${localFiles.length} Image${
                localFiles.length > 1 ? "s" : ""
              } Selected`
            : "Select Images"}
          <input
            type="file"
            multiple
            accept="image/png, image/jpeg, image/gif"
            onChange={(e) => {
              setLocalFiles(Array.from(e.target.files));
            }}
            className="hidden"
            ref={inputRef}
          />
        </Button>
        <Button primary disabled={!localFiles.length} onClick={upload}>
          Add
        </Button>
      </div>
      <Toast toastProps={toastProps} />
    </div>
  );
};

export default ImageUpload;
