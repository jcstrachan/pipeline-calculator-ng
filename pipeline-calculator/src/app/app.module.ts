import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ParameterInputComponent } from './components/parameter-input/parameter-input.component';
import { ExportSettingsComponent } from './components/export-settings/export-settings.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { DataVisualisationComponent } from './components/data-visualisation/data-visualisation.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { ChartComponent } from './components/data-visualisation/chart/chart.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { SubmitDialogComponent } from './dialogues/submit-dialog/submit-dialog.component';
import { ExportDialogComponent } from './dialogues/export-dialog/export-dialog.component';
import { InvalidExportDialogComponent } from './dialogues/invalid-export-dialog/invalid-export-dialog.component';
import { ParameterErrorDialogComponent } from './dialogues/parameter-error-dialog/parameter-error-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ParameterInputComponent,
    ExportSettingsComponent,
    DataVisualisationComponent,
    ChartComponent,
    SubmitDialogComponent,
    ExportDialogComponent,
    InvalidExportDialogComponent,
    ParameterErrorDialogComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    MatSelectModule,
    FormsModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
