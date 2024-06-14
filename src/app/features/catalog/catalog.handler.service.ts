import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStates } from 'app/core/store/reducers';
import * as CatalogSelectors from '../../core/store/selectors';
import { ICatalogNode } from 'app/shared/models/catalog.inteface';
import { v4 as uuidv4 } from 'uuid';
import { NodeTypes } from 'app/shared/enums/node.enums';

@Injectable({
  providedIn: 'root'
})
export class CatalogHandlerService {
  private currentState: ICatalogNode[] = [];

  constructor(public store: Store<AppStates>) {
    this.store.select(
      CatalogSelectors.GetCatalog()
    ).subscribe(state => {
      this.currentState = state;
    });
  }

  setCatalogExpansion(keyToUpdate: string) {
    return this.updateCatalogExpansion(this.currentState, keyToUpdate)
  }

  // Updates the catalog with a new or modified node, handling 
  // various scenarios like insertion, modification, and copying. 
  updateCatalog(newCatalogNode: ICatalogNode, isNew?: boolean, originalCatalogNode?: ICatalogNode, index?: number, isCopy?: boolean, doNoactions?: boolean) {
    if (doNoactions == true) {
      return this.currentState;
    }

    const filteredCatalog = (isCopy || isNew) ? this.currentState : this.removeNodeByKey(this.currentState, originalCatalogNode.key);

    if (isCopy) {
      let catalogNodeToCopy = newCatalogNode.children.find(c => c.key == originalCatalogNode.key)
      const catalogNode = this.findCatalogNodeByKey(this.currentState, newCatalogNode.key)
      const catalogNodeChildren = this.addCatalogNodeAtIndex(index, catalogNodeToCopy, isCopy, [...catalogNode.children])
      newCatalogNode.children = catalogNodeChildren;
    }

    const stack = [...filteredCatalog];

    while (stack.length > 0) {
      const node = stack.pop();

      if (node.key === newCatalogNode.key) {
        Object.assign(node, newCatalogNode);
        return filteredCatalog;
      }

      if (node.children) {
        stack.push(...node.children);
      }
    }

    return this.currentState;
  }

  // Inserts a node into the catalog array at a specific index, 
  // optionally copying the node if needed. 
  addCatalogNodeAtIndex(index: number, node: ICatalogNode, isCopy?: boolean, nodes?: ICatalogNode[]): ICatalogNode[] {
    let data = nodes != undefined ? nodes : this.currentState;
    const filteredCatalog = isCopy ? data : this.removeNodeByKey(data, node.key);

    if (index < 0 || index > filteredCatalog.length) {
      throw new Error("Index out of bounds");
    }

    if (isCopy) {
      node.label = node.label + '-COPY'
      node.key = node.key + '-copy'
    }

    return [
      ...filteredCatalog.slice(0, index),
      node,
      ...filteredCatalog.slice(index)
    ];
  }

  // Updates the values of a node with the provided new values,
  // preserving the original node structure. 
  updateNodeValues(
    key: string,
    newValues: Partial<ICatalogNode>
  ) {
    return this.findAndUpdateNodeValues(this.currentState, key, newValues)
  }

  // Generates a random array of catalog nodes (folders or items), 
   // with a specified quantity.
  generateRandomCatalog(isFolder: boolean, quantity: number): ICatalogNode[] {
    const catalog: ICatalogNode[] = [];

    for (let i = 0; i < quantity; i++) {
      const uuid = uuidv4();

      let icon = '';
      let type = '';
      let children = [];

      if (isFolder) {
        icon = 'pi pi-folder';
        type = NodeTypes.Folder.toString();
      } else {
        type = NodeTypes.Item.toString();
        children = undefined;
      }

      const item: ICatalogNode = {
        key: uuid,
        label: `${this.generateRandomNodeName()}`,
        icon: icon,
        type: type,
        expanded: false,
        children: children
      };

      catalog.push(item);
    }

    return catalog;
  }

  // Generates a random name for a catalog node.
  private generateRandomNodeName() {
    const adjectives = ['Amazing', 'Beautiful', 'Cool', 'Dynamic', 'Elegant', 'Fantastic', 'Happy', 'Incredible', 'Joyful', 'Lovely', 'Marvelous', 'Nice', 'Outstanding', 'Peaceful', 'Quiet', 'Radiant', 'Superb', 'Terrific', 'Unique', 'Wonderful'];
    const nouns = ['Apple', 'Book', 'Cat', 'Dog', 'Eagle', 'Flower', 'Giraffe', 'House', 'Island', 'Jungle', 'Kite', 'Lion', 'Mountain', 'Ocean', 'Penguin', 'Queen', 'Rainbow', 'Star', 'Tree', 'Universe'];

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${randomAdjective}${randomNoun}`;
  }

  // Finds a catalog node within a given array based on its key.
  private findCatalogNodeByKey(nodes, key) {
    for (let node of nodes) {
      if (node.key === key) {
        return node;
      }

      if (node.children) {
        let foundNode = this.findCatalogNodeByKey(node.children, key);
        if (foundNode) {
          return foundNode;
        }
      }
    }

    return null;
  }

  // Updates the expanded state of a node in the catalog based on its key.
  private updateCatalogExpansion(nodes: ICatalogNode[], keyToUpdate: string): ICatalogNode[] {
    return nodes.map(node => {
      if (node.key === keyToUpdate) {
        return {
          ...node,
          expanded: node.expanded != undefined ? !node.expanded : true
        };
      } else if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: this.updateCatalogExpansion(node.children, keyToUpdate)
        };
      } else {
        return node;
      }
    });
  }

  // Finds a node by key within a catalog array and updates its values.
  private findAndUpdateNodeValues(
    nodes: ICatalogNode[],
    key: string,
    newValues: Partial<ICatalogNode>
  ): ICatalogNode[] {
    return nodes.map(node => {
      if (node.key === key) {
        return { ...node, ...newValues };
      } else if (node.children) {
        return { ...node, children: this.findAndUpdateNodeValues(node.children, key, newValues) };
      } else {
        return node;
      }
    });
  }

  // Removes a node from a catalog array based on its key.
  private removeNodeByKey(array: ICatalogNode[], key: string): ICatalogNode[] {
    return array.reduce((acc, node) => {
      if (node.key !== key) {
        acc.push({
          ...node,
          children: node.children ? this.removeNodeByKey(node.children, key) : []
        });
      }
      return acc;
    }, [] as ICatalogNode[]);
  }
}
