import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import * as States  from '../states';
import { CatalogReducer } from './catalog.reducer';

export interface AppStates {
  catalog: States.CatalogState;
}

export const AppReducers: ActionReducerMap<AppStates> = {
  catalog: CatalogReducer
};

export const GetAppStates = createFeatureSelector<AppStates>('App');