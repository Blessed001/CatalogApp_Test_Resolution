import { Action } from '@ngrx/store';
import { ICatalogNode } from 'app/shared/models/catalog.inteface';


export const CATALOG_LOAD_TREE = '[Catalog]: Load Tree';
export const CATALOG_LOAD_SUCESS = '[Catalog]: Load Success';
export const CATALOG_UPDATE_NODE = '[Catalog] Update Node';
export const CATALOG_MOVE_NODE = '[Catalog] Move Node';
export const CATALOG_NODE_EXPANDED = '[Catalog] Node Expanded';
export const CATALOG_NODE_SELECTED = '[Catalog] Node selected';

// This action signals the intent to load the catalog tree data.
export class CatalogLoadAction implements Action {
  readonly type = CATALOG_LOAD_TREE;
}

// This action signals that the catalog tree data has been successfully loaded.
export class CatalogLoadSuccessAction implements Action {
  readonly type = CATALOG_LOAD_SUCESS;

  constructor(public catalog: ICatalogNode[]) {
  }
}

// This action signals that the catalog tree data has been successfully updated.
export class UpdateNodeAction implements Action {
  readonly type = CATALOG_UPDATE_NODE;

  constructor(public catalog: ICatalogNode[]) {
  }
}

// This action signals that the tree node has been moved.
export class MoveNodeAction implements Action {
  readonly type = CATALOG_MOVE_NODE;

  constructor(public newCatalog: ICatalogNode[]) {
  }
}

// This action signals that the tree node has been expanded.
export class NodeExpandedAction implements Action {
  readonly type = CATALOG_NODE_EXPANDED;

  constructor(public newCatalog: ICatalogNode[]) {
  }
}

// This action signals that the tree node has been selected.
export class NodeSelectedAction implements Action {
  readonly type = CATALOG_NODE_SELECTED;

  constructor(public selectedNode: ICatalogNode) {
  }
}

// CatalogActions: This type union defines all possible actions that can be dispatched
// in the catalog domain. It helps ensure that only valid actions are used and improves
// type safety within the application.
export type CatalogActions =
  | CatalogLoadAction
  | CatalogLoadSuccessAction
  | UpdateNodeAction
  | MoveNodeAction
  | NodeExpandedAction
  | NodeSelectedAction;
