import PrimaryButton from "../ui/button/Button";
import { createRef, useState } from "react";
import { apiRequest } from "../../utils/api";
import ImageCollection from "../ImageCollection";
import { Image } from "../../interfaces/ApiResponses";
import { AxiosResponse } from "axios";
import { Toast, useToast } from "../ui/Toast";
import LoadingButton from "../ui/button/LoadingButton";

const ImageUpload: ({
  uploadCallback,
  initialImages,
}: {
  uploadCallback?: (
    res: AxiosResponse | null,
    allRemoteImages: Image[]
  ) => void;
  initialImages?: Image[];
}) => JSX.Element = ({ uploadCallback = () => {}, initialImages = [] }) => {
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [remoteImages, setRemoteImages] = useState<Image[]>(initialImages);
  const [toast, toastProps] = useToast();
  const [loading, setLoading] = useState(false);

  const inputRef = createRef<HTMLInputElement>();

  const upload = (e) => {
    e.preventDefault();

    if (localFiles) {
      const data = new FormData();

      for (const image of localFiles) {
        data.append("images", image);
      }

      setLoading(true);
      apiRequest({
        method: "POST",
        url: "/images/upload",
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          toast("Images Added", "Images added successfully.", "primary");
          setRemoteImages([...remoteImages, ...res.data]);

          uploadCallback(res, [...remoteImages, ...res.data]);
        })
        .catch((err) => {
          if (err?.code === "LIMIT_FILE_SIZE") {
            toast("File Size", "The file is larger than 15 MB");
          } else {
            toast("Error", "There was an error uploading the images", "danger");
          }
          uploadCallback(null, remoteImages);
        })
        .finally(() => {
          setLocalFiles([]);
          setLoading(false);
        });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {remoteImages.length ? (
        <ImageCollection
          images={remoteImages}
          remove={(id: number) => {
            const filteredImages = remoteImages.filter(
              (image) => image.id !== id
            );

            uploadCallback(null, filteredImages);
            setRemoteImages(filteredImages);
          }}
        />
      ) : null}
      <div className="flex gap-2">
        <PrimaryButton
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
        </PrimaryButton>
        <LoadingButton
          loading={loading}
          mode={localFiles.length ? "primary" : "disabled"}
          onClick={upload}
        >
          Add
        </LoadingButton>
      </div>
      <Toast toastProps={toastProps} />
    </div>
  );
};

export default ImageUpload;
