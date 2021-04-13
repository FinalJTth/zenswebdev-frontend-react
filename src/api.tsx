import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

const serverBaseUrl = 'http://localhost:9000/';

const axiosBaseURL = axios.create({
  baseURL: serverBaseUrl,
});

axiosBaseURL.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`REQUEST : ${req.method} ${req.url}\nTOKEN : ${token}`);

    /*
    // Important: request interceptors **must** return the request.
    if (req.url.includes('graphql')) {
      req.headers['Content-Type'] = 'application/json';
      req.useCredentails = false;
    }
    */
    // req.headers['Access-Control-Allow-Origin'] = '*';
    console.log('REQUEST :', req);
    return req;
  },
  (err) => {
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
    console.log('RESPONSE :', res);
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

const axiosGqlQuery = async (pQuery: string | Record<string, any>) => {
  const query = handleGql(pQuery, 'query');
  return axiosBaseURL
    .post('/graphql', JSON.stringify(query), gqlHeader)
    .then((response) => {
      console.log(response.data.data);
      return response.data.data;
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
      console.log('Data : ', res.data.data.Movie);
    })
    .catch((err) => {
      console.log(err.message);
    });
};
*/
const axiosGqlMutation = async (pMutationString: string) => {
  const mutation = handleGql(pMutationString, 'mutation');
  return axiosBaseURL.post('/graphql', JSON.stringify(mutation), gqlHeader);
};

export { axiosTest, axiosGqlQuery, axiosGqlMutation };
