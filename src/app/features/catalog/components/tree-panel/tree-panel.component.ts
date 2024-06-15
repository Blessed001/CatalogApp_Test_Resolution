import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NodeTypes } from 'app/shared/enums/node.enums';
import { ICatalogNode } from 'app/shared/models/catalog.inteface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tree-panel',
  templateUrl: './tree-panel.component.html',
  styleUrls: ['./tree-panel.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class TreePanelComponent {
  @Input() $catalog: Observable<ICatalogNode[]>;
  @Input() selectedNode: ICatalogNode;

  @Output() onNodeDrop = new EventEmitter<any>();
  @Output() onNodeExpand = new EventEmitter<any>();
  @Output() onNodeSelected = new EventEmitter<ICatalogNode>();
  @Output() onNodeCreateItems = new EventEmitter<any>();

  folderType = NodeTypes.Folder.toString();
  itemType = NodeTypes.Item.toString();

  expandedNodes:string[]= []
  constructor() {
  }

  createCatalogItems(type){
    this.onNodeCreateItems.emit(type)
  }


  onNodeSelectHandler(event: any) {
    this.onNodeSelected.emit(event.node)
  }

  onNodeDropHandler(event: any) {
    this.onNodeDrop.emit(event);
  }

  onNodeExpandHandler(event:any){
    this.onNodeExpand.emit(event);
  }
}
