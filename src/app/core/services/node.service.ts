import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { ICatalogNode } from '../../shared/models/catalog.inteface';

@Injectable(
    {providedIn:'root'}
)
export class NodeService {
    
    //Marked to init the catalog from the backend
    getCatalog() {
        let data:ICatalogNode[] = []
        return of(data);
    }
};
