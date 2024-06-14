import { NgModule } from '@angular/core';
import { CatalogRoutingModule } from './catalog-routing.module';
import { CatalogComponent } from './catalog.component';
import { TreePanelComponent } from './components/tree-panel/tree-panel.component';
import { EditorPanelComponent } from './components/editor-panel/editor-panel.component';

import { TreeModule } from 'primeng/tree';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeDragDropService } from 'primeng/api';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [CatalogComponent,TreePanelComponent,EditorPanelComponent],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    TreeModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers:[TreeDragDropService]
})
export class CatalogModule { }
