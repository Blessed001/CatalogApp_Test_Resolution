import { createSelector } from "@ngrx/store";
import { AppStates } from "../reducers";
import { CatalogState } from "../states";
import { makeTreeNodesExtensible } from "../../../shared/utils/utils.functions";
import { ICatalogNode } from "app/shared/models/catalog.inteface";

const selectCatalogState = (state: AppStates) => state.catalog;

// Selects the entire catalog state from the application state
export const GetCatalog = () =>
  createSelector(
    selectCatalogState,
    (state: CatalogState) => {
      return makeTreeNodesExtensible<ICatalogNode>(state.catalog);
    }
  );

// Selects the currently selected node from the catalog state
export const SelectedNode = () =>
  createSelector(
    selectCatalogState,
    (state: CatalogState) => {
      const children = state.selectedNode ? makeTreeNodesExtensible<ICatalogNode>(state.selectedNode.children) : [];
      return { ...state.selectedNode, children };
    }
  );


