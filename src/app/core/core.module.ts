import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppReducers } from '../core/store/reducers';
import { AppEffects } from '../core/store/effects';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot({ ...AppReducers }),
    EffectsModule.forRoot([...AppEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
  ],
  exports: [StoreModule, EffectsModule],
})
export class CoreModule { }
