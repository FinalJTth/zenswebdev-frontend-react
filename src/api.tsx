import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import localForage from 'localforage';
import * as dotenv from 'dotenv';
import JSON5 from 'json5';
import * as https from 'https';
import * as fs from 'fs';
import { buildGraphql } from './utils';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const success = dotenv.config();
console.warn(success);

const serverBaseUrl = 'https://localhost:9000/';
const serverServiceUrl = 'https://localhost:5000/';

export const axiosBaseURL = axios.create({
  baseURL: serverBaseUrl,
  httpsAgent,
});

export const axiosServiceURL = axios.create({
  baseURL: serverServiceUrl,
  httpsAgent,
});

axiosBaseURL.interceptors.request.use(
  async (req: Record<string, any>) => {
    const token = await localForage.getItem('access_token');
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    // req.headers.ReactKey = process.env.REACT_APP_API_KEY;
    // console.log(`REQUEST : ${req.method} ${req.url}\nTOKEN : ${token}`);

    /*
    // Important: request interceptors **must** return the request.
    if (req.url.includes('graphql')) {
      req.headers['Content-Type'] = 'application/json';
      req.useCredentails = false;
    }
    */
    // req.headers['Access-Control-Allow-Origin'] = '*';
    // console.log('REQUEST :', req);
    return req;
  },
  (err: Record<string, any>) => {
    // if (err.response.status === 500) {
    //   return new Error(`Backend Server is down`);
    // }
    // if (err.response.status === 404) {
    //   return new Error(`${err.config.url} not found`);
    // } else if (err.response.status === 401) {
    //   return new Error(`The user is not authorized`);
    // }
    throw err;
  },
);

axiosBaseURL.interceptors.response.use(
  (res: AxiosResponse<any>) => {
    // console.log('RESPONSE :', res);
    return res;
  },
  (err: AxiosResponse<any>) => {
    // if (err.response.status === 500) {
    //   return new Error(`Backend Server is down`);
    // }
    // if (err.response.status === 404) {
    //   return new Error(`${err.config.url} not found`);
    // } else if (err.response.status === 401) {
    //   return new Error(`The user is not authorized`);
    // }
    throw err;
  },
);

/*
const axiosTest = async () => {
  return axiosBaseURL.get('/').catch((error) => console.error(error));
};
*/
const axiosTest = async () => {
  return axios({
    url: 'http://localhost:9000/',
    method: 'get',
  })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

enum gqlType {
  QUERY,
  MUTATION,
}

const gqlHeader = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const handleGql = (pObject: string | Record<string, any>, type: string) => {
  let returngql;
  if (typeof pObject === 'string') {
    try {
      const object = JSON.parse(pObject);
      returngql = object;
    } catch (error) {
      returngql = {
        [type]: pObject,
      };
    }
  } else {
    returngql = pObject;
  }
  return returngql;
};

const handleResponseError = (response: Record<string, any>) => {
  if (
    response.data.errors[0].extensions &&
    response.data.errors[0].extensions._stack
  ) {
    const { exception } = response.data.errors[0].extensions;
    throw new Error(`${exception._stack}`);
  } else {
    let message = '';
    response.data.errors.map((error: any, index: number) => {
      let locations = '';
      if (error.locations) {
        error.locations.map(
          (location: Record<string, any>, locationIndex: number) => {
            locations += `\tat ${locationIndex} ${JSON.stringify(location)}\n`;
            return location;
          },
        );
      }
      message += `${index} ${error.message}\n${locations}`;
      return error;
    });
    throw new Error(message);
  }
};

const axiosGqlQuery = async (
  overloadingParam: string, // resolver or query string
  parameters?: Record<string, any> | string,
  returnValues?: Array<any> | string,
) => {
  const query = parameters
    ? buildGraphql('query', overloadingParam, parameters, returnValues)
    : overloadingParam;
  return axiosBaseURL
    .post('/graphql', JSON.stringify({ query }), gqlHeader)
    .then((response: Record<string, any>) => {
      if (response.data.errors && response.data.errors.length > 0) {
        handleResponseError(response);
      }
      return response.data;
    });
};

const axiosGqlMutation = async (
  overloadingParam: string, // resolver or query string
  parameters?: Record<string, any> | string,
  returnValues?: Array<any> | string,
) => {
  const query = parameters
    ? buildGraphql('mutation', overloadingParam, parameters, returnValues)
    : overloadingParam;
  return axiosBaseURL
    .post('/graphql', JSON.stringify({ query }), gqlHeader)
    .then((response: Record<string, any>) => {
      if (response.data.errors && response.data.errors.length > 0) {
        if (response.data.errors && response.data.errors.length > 0) {
          handleResponseError(response);
        }
      }
      return response.data;
    });
};

/*
const axiosGqlQuery = async (pQuery: string | Record<string, any>) => {
  const query = handleGql(pQuery, 'query');
  return axios({
    url: 'http://localhost:9000/graphql',
    method: 'post',
    data: query,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then((res) => {
      console.log('Data : ', res.data.query.data.Movie);
    })
    .catch((err) => {
      console.log(err.message);
    });
};
*/

const axiosGqlServiceQuery = async (
  overloadingParam: string, // resolver or query string
  parameters?: Record<string, any> | string,
  returnValues?: Array<any> | string,
) => {
  const query = parameters
    ? buildGraphql('query', overloadingParam, parameters, returnValues)
    : overloadingParam;
  return axiosServiceURL
    .post('/graphql', JSON.stringify({ query }), gqlHeader)
    .then((response: Record<string, any>) => {
      if (response.data.errors && response.data.errors.length > 0) {
        if (response.data.errors && response.data.errors.length > 0) {
          handleResponseError(response);
        }
      }
      return response.data;
    });
};

export { axiosTest, axiosGqlQuery, axiosGqlMutation, axiosGqlServiceQuery };
