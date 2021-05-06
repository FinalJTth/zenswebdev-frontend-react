import { createContext, useContext } from 'react';
import ClassifyModel from './ClassifyModel';
import User from './User';

export const stores = {
  ClassifyModel,
  User,
};

export const storesContext = createContext(stores);
export const useStores = () => useContext(storesContext);
