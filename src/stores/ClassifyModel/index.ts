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
import Promise from 'bluebird';
import * as uuid from 'uuid';
import { axiosGqlQuery, axiosGqlServiceQuery } from '../../api';
import { buildGraphql, toBase64 } from '../../utils';

export interface IPredictionType {
  id?: string;
  object?: string;
  confident?: number;
}

export interface IClassifyPictureType {
  name?: string;
  size?: number;
  url?: string;
}

export interface IClassifyPredictionsType {
  picture: IClassifyPictureType;
  predictions: Array<IPredictionType>;
  isLoading: boolean;
}

const Prediction = types.model('CPrediction', {
  id: types.maybe(types.string),
  object: types.maybe(types.string),
  confident: types.maybe(types.number),
});

const Picture = types.model('CPicture', {
  name: types.maybe(types.string),
  size: types.maybe(types.number),
  url: types.maybe(types.string),
});

const Predictions = types.model('CPredictions', {
  picture: Picture,
  predictions: types.array(Prediction),
  isLoading: types.boolean,
});

const ClassifyModel = types
  .model('ClassifyModel', {
    datas: types.array(Predictions),
  })
  .actions((self) => {
    const getPredictions = flow(function* getPredictions(
      parameters: Record<string, any> | string,
      returnValues?: Array<any> | string,
    ) {
      return yield axiosGqlServiceQuery(
        'ClassifyImage',
        parameters,
        returnValues,
      )
        .then((res: { data: Record<string, any> }) => {
          console.log('getPredictions', res);
          return res.data.query;
        })
        .catch((error) => {
          console.error(
            'Error occured while getting classify model predictions\n',
            error.message,
          );
          throw new Error(error.message.split('\n')[0]);
        });
    });

    const getDatas = () => {
      return self.datas;
    };

    const setDatas = (datas: Array<IClassifyPredictionsType>) => {
      self.datas = cast([...datas]);
    };

    return {
      getPredictions,
      getDatas,
      setDatas,
    };
  })
  .create({
    datas: [],
  });

export default ClassifyModel;
