import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as CatalogActions from '../actions/catalog.actions';
import { NodeService } from "../../services/node.service";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class CatalogEffects {
  constructor(
    private actions$: Actions,
    private nodesService:NodeService
  ) {
  }

  // This effect listens for CatalogLoadAction actions. When received, it fetches catalog data from 
  // the nodesService and dispatches it to the store.
  LoadCatalog$ = createEffect(() =>
    this.actions$.pipe(
      ofType<CatalogActions.CatalogLoadAction>(CatalogActions.CATALOG_LOAD_TREE),
      switchMap(() => {
          return this.nodesService.getCatalog()
            .pipe(
              map(response => new CatalogActions.CatalogLoadSuccessAction(response))
            );
        }
      )
    ),
  {useEffectsErrorHandler: false}
);
}


