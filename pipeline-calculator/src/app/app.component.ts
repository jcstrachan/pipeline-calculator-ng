import { Component } from '@angular/core';
import { IPipelineParameters } from './interfaces/pipeline-parameters';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PBMC';
  private parameters!: IPipelineParameters;

  updateParameters(event: IPipelineParameters) {
    this.parameters = event;
    this.beginCalculations();
  }

  beginCalculations() {
    // The first step to the calculations is to get the xy coordinates
  }



}
