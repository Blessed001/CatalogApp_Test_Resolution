import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStates } from '../../core/store/reducers';
import * as CatalogActions from '../../core/store/actions';
import * as CatalogSelectors from '../../core/store/selectors';
import { ICatalogNode } from '../../shared/models/catalog.inteface';
import { Observable, Subscription, tap } from 'rxjs';
import { CatalogHandlerService } from './catalog.handler.service';
import { NodeTypes } from 'app/shared/enums/node.enums';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CatalogComponent implements OnInit, OnDestroy{
  $catalog!: Observable<ICatalogNode[]>;
  selectedNode!: ICatalogNode;
  isTreeEmpty: boolean = true;
  $selectedNodeSubscription:Subscription;

  constructor(public store: Store<AppStates>, private catalogHandler:CatalogHandlerService) {}

  ngOnInit() {
    this.store.dispatch(
      new CatalogActions.CatalogLoadAction()
    );

    this.$catalog = this.store.select(
      CatalogSelectors.GetCatalog()
    ).pipe(tap(state => {
      this.isTreeEmpty = state.length == 0
    }));

    this.$selectedNodeSubscription = this.store.select(
      CatalogSelectors.SelectedNode()
    ).subscribe(node => {
      if (node && node.key) {
        this.selectedNode = node;
      }

    });
  }

  // Handles the drag-and-drop event for nodes in the catalog, 
  // updating the catalog state based on the drop location and shift key status.
  onNodeDrop(event: any) {

    const movedNode = event.dragNode;
    const movedToNode = event.dropNode;
    const newIndex = event.index;
    const shiftClicked = event.originalEvent.shiftKey;

    const isMovedIntoNode = this.isMovedIntoNode(movedToNode, movedNode);
    const shouldDoNoActions = this.shouldDoNoActions(movedNode, movedToNode);

    let updatedCatalog: ICatalogNode[] = [];

    if (movedToNode.parent && !isMovedIntoNode) {
        updatedCatalog = this.handleParentNodeDrop(movedToNode, movedNode, newIndex, shiftClicked);
    } else if (isMovedIntoNode) {
        updatedCatalog = this.handleNodeDropIntoNode(movedToNode, movedNode, newIndex, shiftClicked, shouldDoNoActions);
    } else if (!isMovedIntoNode && !movedToNode.parent) {
        updatedCatalog = this.handleTopLevelDrop(newIndex, movedNode, shiftClicked);
    }

    if (updatedCatalog.length > 0) {
        this.store.dispatch(new CatalogActions.MoveNodeAction(updatedCatalog));
    }
  }

    // Handles the creation of items (or folders) within the catalog, 
  // generating random nodes based on the selected type and adding them
  // to either the top level or the selected folder.
  onNodeCreateItems(event){
    const isFolder = event == NodeTypes.Folder.toString();
    const createdNodes = this.catalogHandler.generateRandomCatalog(isFolder,50);

    if(createdNodes.length>0){
      if(this.isTreeEmpty){
        this.store.dispatch(new CatalogActions.UpdateNodeAction(createdNodes))
      }else if(this.selectedNode && this.selectedNode.children){
          this.selectedNode.children.push(...createdNodes);
          const updatedCatalog = this.catalogHandler.updateCatalog(this.selectedNode,true);
          this.store.dispatch(new CatalogActions.UpdateNodeAction(updatedCatalog))
      }else{
        alert("Please select some folder to continue")
      }
    }
  }

  onNodeExpand(event:any){
    let updatedCatalog = this.catalogHandler.setCatalogExpansion(event.node.key);
    this.store.dispatch(
      new CatalogActions.NodeExpandedAction(updatedCatalog)
    );
  }

  onNodeSelected(event:ICatalogNode){
     this.store.dispatch(new CatalogActions.NodeSelectedAction(event))
  }

  onSaveNodeChange(event:ICatalogNode){
    const updatedCatalog = this.catalogHandler.updateNodeValues(event.key, {label:event.label, icon:event.icon});
    this.store.dispatch(new CatalogActions.UpdateNodeAction(updatedCatalog))
  }

  private isMovedIntoNode(movedToNode: ICatalogNode, movedNode: ICatalogNode): boolean {
      return movedToNode.children.find((n: ICatalogNode) => n.key === movedNode.key) !== undefined;
  }

  private shouldDoNoActions(movedNode: ICatalogNode, movedToNode: ICatalogNode): boolean {
      return movedNode.type === NodeTypes.Item.toString() && movedToNode.type === NodeTypes.Item.toString();
  }

  private handleParentNodeDrop(movedToNode: ICatalogNode, movedNode: ICatalogNode, newIndex: number, shiftClicked: boolean): ICatalogNode[] {
      const newNode = movedToNode.parent;
      const updatedCatalog = this.catalogHandler.updateCatalog(newNode,false, movedNode, newIndex, shiftClicked);
      return updatedCatalog;
  }

  private handleNodeDropIntoNode(movedToNode: ICatalogNode, movedNode: ICatalogNode, newIndex: number, shiftClicked: boolean, doNoactions: boolean): ICatalogNode[] {
      const newNode = movedToNode;
      const updatedCatalog = this.catalogHandler.updateCatalog(newNode,false, movedNode, newIndex, shiftClicked, doNoactions);
      return updatedCatalog;
  }

  private handleTopLevelDrop(newIndex: number, movedNode: any, shiftClicked: boolean): ICatalogNode[] {
      const updatedCatalog = this.catalogHandler.addCatalogNodeAtIndex(newIndex, movedNode, shiftClicked);
      return updatedCatalog;
  }

  ngOnDestroy(): void {
    this.$selectedNodeSubscription.unsubscribe()
  }
}
