import * as Actions from '../actions';
import { CatalogState } from '../states';

const initialState: CatalogState = {
  catalog: [],
  selectedNode:undefined,
  loaded: false,
  loading: false,
};

//Update the state of a Catalog tree 
export function CatalogReducer(state: CatalogState = initialState, action: Actions.CatalogActions): CatalogState {
  switch (action.type) {
    case Actions.CATALOG_LOAD_TREE: {
      return {
        ...state,
        loading: true
      };
    }
    case Actions.CATALOG_LOAD_SUCESS: {
      if(action.catalog == undefined )
      {
        console.log("Something is wrong - data is null");
      }

      return {
        ...state,
        loaded: true,
        loading: false,
        catalog: action.catalog
      };
    }
    case Actions.CATALOG_UPDATE_NODE: {
      return {
        ...state,
        catalog: action.catalog
      };
    }
    case Actions.CATALOG_MOVE_NODE: {

      return {
        ...state,
        catalog: action.newCatalog
      };
    }
    case Actions.CATALOG_NODE_EXPANDED: {

      return {
        ...state,
        catalog: action.newCatalog
      };
    }
    case Actions.CATALOG_NODE_SELECTED: {
      return {
        ...state,
        selectedNode: action.selectedNode
      };
    }
    default:
      return state;
  }
}