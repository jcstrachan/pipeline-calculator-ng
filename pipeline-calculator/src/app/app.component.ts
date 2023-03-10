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

  public updateParameters(event: IPipelineParameters) {
    this.parameters = event;
    this.beginCalculations();
  }

  private beginCalculations() {
    // The first step to the calculations is to get the xz coordinates
    var x: number[] = [];
    var z: number[] = [];
    [x, z] = this.calculateXZ(this.parameters.thetaS)


  }

  private calculateXZ(thetaS: string) {
    // First, we convert the string of Theta S values to an array of numbers
    const cleanThetaS = thetaS.replace(/\s+/g, '');
    const thetaSArrStr = cleanThetaS.split(',');
    const thetaSArr = thetaSArrStr.map((str) => Number(str));

    // Now, we will first calculate the x values across the arc-length 's' of the pipeline
    


    return [xVals, zVals]
  }




}
