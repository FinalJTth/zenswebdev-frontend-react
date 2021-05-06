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

interface IClassifyPredictionType {
  id?: string;
  object?: string;
  confident?: number;
}

interface IClassifyPictureType {
  name?: string;
  size?: number;
  url?: string;
}

export type ClassifyPredictionsType = {
  picture: IClassifyPictureType;
  predictions: Array<IClassifyPredictionType>;
  isLoading: boolean;
};

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
    payloads: types.array(Predictions),
  })
  .actions((self) => ({
    getPredictions: flow(function* getPredictions(
      parameters: Record<string, any> | string,
      returnValues?: Array<any> | string,
    ): Generator<any, any, any> {
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
    }),

    getPayloads() {
      return self.payloads;
    },

    setPayloads(payloads: Array<ClassifyPredictionsType>) {
      self.payloads = cast([...payloads]);
    },
  }))
  .create({
    payloads: [],
  });

export default ClassifyModel;
