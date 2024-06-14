import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ICatalogNode } from 'app/shared/models/catalog.inteface';


@Component({
  selector: 'app-editor-panel',
  templateUrl: './editor-panel.component.html',
  styleUrls: ['./editor-panel.component.scss']
})
export class EditorPanelComponent implements OnChanges {
  @Input() selectedNode: ICatalogNode;

  @Output() onSaveNodeChange = new EventEmitter<ICatalogNode>()

  form: FormGroup; 

  iconOptions = [
    { label: 'File', value: 'pi pi-file' },
    { label: 'Folder', value: 'pi pi-folder' },
    { label: 'Calendar', value: 'pi pi-calendar' },
    { label: 'User', value: 'pi pi-user' }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      label: [''],
      icon: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedNode'] && this.selectedNode) {
      this.form.patchValue({
        label: this.selectedNode.label,
        icon: this.selectedNode.icon
      });
    }
  }

  saveChangesHandler() {
    const iconValue = this.form.value.icon?.value !== undefined ? this.form.value.icon.value : this.form.value.icon;
    const updatedNode = { ...this.selectedNode, label: this.form.value.label, icon: iconValue };
    this.onSaveNodeChange.emit(updatedNode);
  }
}
