import { Component } from '@angular/core';
import { IPipelineParameters } from './interfaces/pipeline-parameters';
import * as numeric from 'numeric';

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
    // Initialising the required variable
    // x and z are arrays of node positions in the x and z axis respectively
    // w_g = Pipeline Immersed Gravity, A = Pipeline Cross-section Area
    var x: number[] = [];
    var z: number[] = [];
    const A: number = Math.PI * (Math.pow(this.parameters.pipelineOuterDiameter/2, 2) - (Math.pow(this.parameters.pipelineOuterDiameter/2 - this.parameters.pipelineWallThickness, 2)));
    const w_g: number = (this.parameters.pipelineDensity - this.parameters.seawaterDensity) * 9.81 * A;

    // The first step to the calculations is to get the xz coordinates
    [x, z] = this.calculateXZ(this.parameters, w_g);

    // Next we can calculate the 


  }

  private calculateXZ(parameters: IPipelineParameters, w_g: number): Array<Array<number>> {
    // Initialising the required variables
    // x and y coordinate values
    let xVals: number[] = [];
    let zVals: number[] = [];
    // deltaS = is the length of each finite difference subinterval
    let deltaS: number = this.parameters.spanLength / this.parameters.finiteDifferenceSubintervalAmount;
    let embedment: number = w_g / parameters.seafloorStiffness;

    // We will first calculate the x coordinate across the arc-length 's' of the pipeline using equation 15
    let currentInterval: number = deltaS;
    for (let i = 0; i < parameters.finiteDifferenceSubintervalAmount; i++) {
      let totalValue: number = 0;
      for (let j = 0; j < i - 1; j++) {
        totalValue += Math.cos(this.getThetaValue(parameters.thetaFunction, currentInterval));
        currentInterval += deltaS;
      }
      xVals.push(totalValue)
    }

    // Next we can calculate the z coordinate using equation 16
    currentInterval = deltaS;
    for (let i = 0; i < parameters.finiteDifferenceSubintervalAmount; i++) {
      let totalValue = 0;
      for (let j = 0; j < i - 1; j++) {
        totalValue += Math.sin(this.getThetaValue(parameters.thetaFunction, currentInterval));
        currentInterval += deltaS;
      }
      totalValue += embedment;
      zVals.push(totalValue)
    } 

    // We can now return the x and z values
    return [xVals, zVals]
  }

  private getThetaValue(thetaFunction: string, s:number): number {
    let thetaValue: number = 0
    return thetaValue
  }




}
