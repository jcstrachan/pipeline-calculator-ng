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
import { SettingsComponent } from './components/settings/settings.component';
import { ChartComponent } from './components/data-visualisation/chart/chart.component';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    AppComponent,
    ParameterInputComponent,
    ExportSettingsComponent,
    DataVisualisationComponent,
    SettingsComponent,
    ChartComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
