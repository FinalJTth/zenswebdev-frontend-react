import { types, flow, cast, Instance } from 'mobx-state-tree';
import localForage from 'localforage';
import { persist } from 'mst-persist';
import {
  axiosGqlQuery,
  axiosGqlMutation,
  axiosGqlServiceQuery,
} from '../../api';

export interface IUserProfile {
  profileId: string;
  firstName: string;
  lastName: string;
  sex: string;
  profilePicture: string;
}

export interface IUser {
  userId: string;
  username: string;
  email: string;
  role: Role;
  profile: IUserProfile;
}

export enum Role {
  guest = 'guest',
  user = 'user',
  admin = 'admin',
  owner = 'owner',
}

export enum RoleInput {
  guest = 'enum_guest',
  user = 'enum_user',
  admin = 'enum_admin',
  owner = 'enum_owner',
}

const UserProfile = types.model('UserProfile', {
  profileId: types.string,
  firstName: types.string,
  lastName: types.string,
  sex: types.string,
  profilePicture: types.maybe(types.string),
});

const UserData = types.model('UserData', {
  userId: types.string,
  username: types.string,
  email: types.string,
  role: types.enumeration<Role>('Role', Object.values(Role)),
  profile: types.optional(UserProfile, {
    profileId: '',
    firstName: '',
    lastName: '',
    sex: '',
    profilePicture: '',
  }),
});

interface IUserMST extends Instance<typeof UserData> {}
interface IUserProfileMST extends Instance<typeof UserProfile> {}

const UserModel = types
  .model('UserModel', {
    usersContainer: types.array(UserData),
    currentUser: UserData,
    isAuthenticated: types.boolean,
  })
  .actions((self) => {
    // GETTER
    const getUsersContainer = (): Array<IUserMST> => {
      return self.usersContainer;
    };
    const getCurrentUser = (): IUserMST => {
      return self.currentUser;
    };
    const getIsAuthenticated = (): Instance<typeof types.boolean> => {
      return self.isAuthenticated;
    };
    const getCurrentUserProfile = (): IUserProfileMST => {
      return self.currentUser.profile;
    };
    // SETTER
    const setUsersContainer = (users: Array<IUser>) => {
      self.usersContainer = cast(users);
    };
    const setCurrentUser = (user: IUser) => {
      self.currentUser = user;
    };
    const setIsAuthenticated = (isAuthenticated: boolean) => {
      self.isAuthenticated = isAuthenticated;
    };
    const setCurrentUserProfile = (user: IUserProfile) => {
      self.currentUser.profile = user;
    };

    return {
      getUsersContainer,
      getCurrentUser,
      getIsAuthenticated,
      getCurrentUserProfile,
      setUsersContainer,
      setCurrentUser,
      setIsAuthenticated,
      setCurrentUserProfile,
    };
  })
  .actions((self) => {
    // API
    const getUserByQuery = flow(function* getUserByQuery(
      parameters: Record<string, any> | string,
      returnValues?: Array<any> | string,
    ): Generator<any, any, any> {
      return yield axiosGqlQuery('User', parameters, returnValues)
        .then((res: { data: Record<string, any> }) => {
          return res.data.query;
        })
        .catch(() => {
          console.error('Error occured while getting user info');
        });
    });

    const login = flow(function* login(
      parameters: Record<string, any> | string,
      returnValues?: Array<any> | string,
    ): Generator<any, any, any> {
      return yield axiosGqlQuery('Login', parameters, returnValues)
        .then(async (res: { data: Record<string, any> }) => {
          console.log('Login', res);
          await localForage.setItem('access_token', res.data.query);
          self.setIsAuthenticated(true);
        })
        .catch((error) => {
          console.error('Error occured while loghing in\n', error.message);
          throw new Error(error.message.split('\n')[0]);
        });
    });

    const logout = () => {
      localForage.removeItem('access_token');
      self.setIsAuthenticated(false);
    };

    const signup = flow(function* register(
      parameters: Record<string, any>,
      returnValues?: Array<any>,
    ) {
      const {
        data: { profile, ...restParameters },
      } = parameters;
      const userParameters = restParameters;
      const profileParameters = profile;
      const userResult = yield axiosGqlMutation(
        'CreateUser',
        {
          data: userParameters,
        },
        ['userId'],
      )
        .then((res: { data: Record<string, any> }) => {
          console.log('Signup_CreateUser', res);
          return res.data.query;
        })
        .catch((error) => {
          console.error('Error occured while creating user\n', error.message);
          throw new Error(error.message.split('\n')[0]);
        });
      const profileResult = yield axiosGqlMutation(
        'CreateProfile',
        {
          data: profileParameters,
        },
        ['profileId'],
      )
        .then((res) => {
          console.log('Signup_CreateProfile', res);
          return res.data.query;
        })
        .catch((error) => {
          console.error(
            "Error occured while create user's profile\n",
            error.message,
          );
          throw new Error(error.message.split('\n')[0]);
        });
      return yield axiosGqlMutation(
        'AddUserProfile',
        {
          from: {
            userId: userResult.userId,
          },
          to: {
            profileId: profileResult.profileId,
          },
        },
        returnValues,
      )
        .then((res) => {
          console.log('Signup_AddUserProfile', res);
          return res.data.query;
        })
        .catch((error) => {
          console.error(
            'Error occured while create user profile relation\n',
            error.message,
          );
          throw new Error(error.message.split('\n')[0]);
        });
    });
    // VALIDATION

    const validateUsername = flow(function* validateUsername(
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
    });

    const validateEmail = flow(function* validateEmail(
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
    });

    const validatePassword = flow(function* validatePassword(
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
    });

    return {
      getUserByQuery,
      login,
      logout,
      signup,
      validateUsername,
      validateEmail,
      validatePassword,
      afterCreate: async () => {
        const token = await localForage.getItem('access_token');
        if (token) {
          self.setIsAuthenticated(true);
        }
      },
    };
  })
  .create({
    usersContainer: [],
    currentUser: {
      userId: '',
      username: '',
      email: '',
      role: Role.guest,
      profile: {
        profileId: '',
        firstName: '',
        lastName: '',
        sex: '',
        profilePicture: '',
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
