import { useRouter } from "next/router";

const getSingleParams = (
  params: {
    [param: string]: string | string[];
  } = useRouter().query
): { [param: string]: string } => {
  const out = {};

  for (const param of Object.keys(params)) {
    out[param] = Array.isArray(params[param])
      ? params[param][0]
      : params[param];
  }

  return out;
};

export { getSingleParams };
