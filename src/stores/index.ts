import { createContext, useContext } from 'react';
import User from './User';

export const stores = {
  User,
};

export const storesContext = createContext(stores);
export const useStores = () => useContext(storesContext);
