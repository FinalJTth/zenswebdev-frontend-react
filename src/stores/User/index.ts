import {
  types,
  flow,
  unprotect,
  cast,
  Instance,
  IArrayType,
  IMSTArray,
  IAnyType,
  IMaybe,
} from 'mobx-state-tree';
import localForage from 'localforage';
import { persist } from 'mst-persist';
import { axiosGqlQuery, axiosGqlServiceQuery } from '../../api';
import { buildGraphql } from '../../utils';

type UserPersonalDataType = {
  firstName: string;
  lastName: string;
  sex: string;
};

type UserDataType = {
  username: string;
  email: string;
  role: string;
  profilePicture: string | undefined;
  personalData: UserPersonalDataType | undefined;
};

const UserPersonalData = types.model('UserPersonalData', {
  firstName: types.string,
  lastName: types.string,
  sex: types.string,
});

const UserData = types.model('UserData', {
  username: types.string,
  email: types.string,
  role: types.string,
  profilePicture: types.maybe(types.string),
  personalData: types.maybe(UserPersonalData),
});

type UserDataMSTType = Instance<typeof UserData>;
type UserPersonalDataMSTType = Instance<typeof UserPersonalData | undefined>;

const UserModel = types
  .model('UserModel', {
    usersContainer: types.array(UserData),
    currentUser: UserData,
    isAuthenticated: types.boolean,
  })
  .actions((self) => ({
    // API
    getUserByQuery: flow(function* getUserByQuery(
      parameters: Record<string, any> | string,
      returnValues?: Array<any> | string,
    ): Generator<any, any, any> {
      return yield axiosGqlQuery('User', parameters, returnValues)
        .then((res: { data: Record<string, any> }) => {
          return res.data.query;
        })
        .catch(() => {
          console.error('There has been some error occured');
        });
    }),

    login: flow(function* login(
      parameters: Record<string, any> | string,
      returnValues?: Array<any> | string,
    ): Generator<any, any, any> {
      return yield axiosGqlQuery('Login', parameters, returnValues)
        .then(async (res: { data: Record<string, any> }) => {
          console.log('Login', res);
          await localForage.setItem('access_token', res.data.query);
        })
        .catch((error) => {
          console.error('Error occured while log in\n', error.message);
          throw new Error(error.message.split('\n')[0]);
        });
    }),
    // VALIDATION

    validateUsername: flow(function* validateUsername(
      parameters: Record<string, any> | string,
      returnValues?: Array<any> | string,
    ): Generator<any, any, any> {
      return yield axiosGqlServiceQuery(
        'ValidateUsername',
        parameters,
        returnValues,
      )
        .then((res: { data: Record<string, any> }) => {
          console.log('ValidateUsername', res);
          return res.data.query;
        })
        .catch((error) => {
          console.error(
            'Error occured while validating username\n',
            error.message,
          );
          throw new Error(error.message.split('\n')[0]);
        });
    }),

    validateEmail: flow(function* validateEmail(
      parameters: Record<string, any> | string,
      returnValues?: Array<any> | string,
    ): Generator<any, any, any> {
      return yield axiosGqlServiceQuery(
        'ValidateEmail',
        parameters,
        returnValues,
      )
        .then((res: { data: Record<string, any> }) => {
          console.log('ValidateEmail', res);
          return res.data.query;
        })
        .catch((error) => {
          console.error(
            'Error occured while validating Email\n',
            error.message,
          );
          throw new Error(error.message.split('\n')[0]);
        });
    }),

    validatePassword: flow(function* validatePassword(
      parameters: Record<string, any> | string,
      returnValues?: Array<any> | string,
    ): Generator<any, any, any> {
      return yield axiosGqlServiceQuery(
        'ValidatePassword',
        parameters,
        returnValues,
      )
        .then((res: { data: Record<string, any> }) => {
          console.log('ValidatePassword', res);
          return res.data.query;
        })
        .catch((error) => {
          console.error(
            'Error occured while validating password\n',
            error.message,
          );
          throw new Error(error.message.split('\n')[0]);
        });
    }),

    // GETTER
    getUsersContainer(): Array<UserDataMSTType> {
      return self.usersContainer;
    },
    getCurrentUser(): UserDataMSTType {
      return self.currentUser;
    },
    getIsAuthenticated(): Instance<typeof types.boolean> {
      return self.isAuthenticated;
    },
    getCurrentUserPersonalData(): UserPersonalDataMSTType {
      return self.currentUser.personalData;
    },
    // SETTER
    setUsersContainer(users: Array<UserDataType>) {
      self.usersContainer = cast(users);
    },
    setCurrentUser(user: UserDataType) {
      self.currentUser = user;
    },
    setIsAuthenticated(isAuthenticated: boolean) {
      self.isAuthenticated = isAuthenticated;
    },
    setCurrentUserPersonalData(user: UserPersonalDataType) {
      self.currentUser.personalData = user;
    },
  }))
  .create({
    usersContainer: [],
    currentUser: {
      username: '',
      email: '',
      role: '',
      profilePicture: '',
      personalData: {
        firstName: '',
        lastName: '',
        sex: '',
      },
    },
    isAuthenticated: false,
  });

persist('User', UserModel, {
  storage: localForage,
  jsonify: false,
  whitelist: ['currentUser', 'isAuthenticated'],
}).then(() => console.log('UserStore has been hydrated'));

export default UserModel;
