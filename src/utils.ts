import axios, { AxiosResponse } from 'axios';
import JSON5 from 'json5';

const graphQLParamMap = JSON5.parse(`{ "'": '"', ':': ': ', ',': ' '}`);

export const toGraphQLParameterString = (obj: Record<string, any>): string => {
  const regex = new RegExp(Object.keys(graphQLParamMap).join('|'), 'gi');
  const str = JSON5.stringify(obj);
  return str
    .substring(1, str.length - 1)
    .replace(regex, (matched) => graphQLParamMap[matched]);
};

const graphQLReturnMap = JSON5.parse(`{ ',': ' ', "'": ''}`);

export const toGraphQLReturnString = (arr: Array<string>): string => {
  const regex = new RegExp(Object.keys(graphQLReturnMap).join('|'), 'gi');
  const str = JSON5.stringify(arr);
  return str
    .substring(1, str.length - 1)
    .replace(regex, (matched) => graphQLReturnMap[matched]);
};

export const buildGraphql = (
  type: string,
  resolver: string,
  parameters: Record<string, any> | string,
  returnValues?: Array<string> | string,
): string => {
  const params =
    typeof parameters === 'string' || parameters instanceof String
      ? parameters
      : toGraphQLParameterString(parameters);
  let rv;
  if (returnValues) {
    rv =
      typeof returnValues === 'string' || returnValues instanceof String
        ? returnValues
        : ` {${toGraphQLReturnString(returnValues)}}`;
  } else {
    rv = '';
  }
  return `{ ${type}: ${resolver}(${params})${rv}}`;
};

export async function uploadPicture(data: any) {
  const fd = new FormData();
  fd.append('file', data);
  fd.append('upload_preset', 'iyvlpgev');
  const url = await axios
    .post('https://api.cloudinary.com/v1_1/zenesta/image/upload', fd)
    .then((res: AxiosResponse) => {
      console.log(res);
      return res.data.secure_url;
    });
  return url;
}

export type Merge<A, B> = { [K in keyof A]: K extends keyof B ? B[K] : A[K] } &
  B extends infer O
  ? { [K in keyof O]: O[K] }
  : never;
