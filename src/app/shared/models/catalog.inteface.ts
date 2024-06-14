export interface ICatalogNode {
    key: string;
    label: string;
    icon: string;
    data?: string;
    type?:string;
    expanded?:boolean
    children?: ICatalogNode[];
    parent?: ICatalogNode;
}
