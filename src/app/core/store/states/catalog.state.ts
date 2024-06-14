import { ICatalogNode } from "../../../shared/models/catalog.inteface";

export interface CatalogState {
    catalog: ICatalogNode[];
    selectedNode:ICatalogNode;
    loaded: boolean;
    loading: boolean;
}