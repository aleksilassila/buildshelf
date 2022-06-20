import CloseIcon from "./icons/CloseIcon";
import {Image} from "../interfaces/ApiResponses";

const ImageCollection: ({
  images,
  remove,
}: {
  images: Image[];
  remove?: (id: number) => void | null;
}) => JSX.Element = ({ images, remove = null }) => {
  return (
    <div className="flex gap-2 overflow-x-scroll h-48 md:h-56 lg:h-64 xl:h-76 pb-2">
      {images.map((image, key) => {
        return (
          <div key={key} className="relative group">
            {remove != null ? (
              <div
                onClick={() => remove(image.id)}
                className="hidden group-hover:flex absolute top-1.5 right-1.5 bg-stone-50 hover:bg-stone-200 text-stone-600 hover:text-stone-800 w-6 h-6 rounded-full items-center justify-center cursor-pointer"
              >
                <CloseIcon className="w-3 h-3" />
              </div>
            ) : null}
            <img
              className={`rounded-xl max-w-none h-full`}
              src={`${process.env.BACKEND_ENDPOINT}/files/${image.filename}`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ImageCollection;
