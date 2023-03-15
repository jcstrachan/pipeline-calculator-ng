import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ParameterInputComponent } from './components/parameter-input/parameter-input.component';
import { ExportSettingsComponent } from './components/export-settings/export-settings.component';

import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

@NgModule({
  declarations: [
    AppComponent,
    ParameterInputComponent,
    ExportSettingsComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
