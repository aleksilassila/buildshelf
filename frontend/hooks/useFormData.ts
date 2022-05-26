import { useEffect, useState } from "react";
import Localstorage from "../utils/localstorage";

const useFormData = <T>(
  initialData: T,
  localStorageKey: string = null
): [T, (T) => void, (any) => (any) => void] => {
  const [data, setData] = useState<T>(localStorageKey ? null : initialData);

  const changeField = (field) => (value) => {
    setData({
      ...data,
      [field]: value,
    });
  };

  useEffect(() => {
    if (data === null && typeof window !== "undefined") {
      setData(Localstorage.get(localStorageKey) || initialData);
    }
  });

  return [data, setData, changeField];
};

export default useFormData;
