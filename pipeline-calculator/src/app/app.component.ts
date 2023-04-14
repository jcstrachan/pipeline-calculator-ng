import { Component } from '@angular/core';
import { IPipelineParameters } from './interfaces/pipeline-parameters';
import * as numeric from 'numeric';
import { IPipeline } from './interfaces/pipeline';

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
    for (let i = 0; i < 110; i++) {
      this.calculatePipeline(i);
    }
  }

  private calculatePipeline(buoyancyLength: number) {
    // Initialising the required variable
    // x and z are arrays of node positions in the x and z axis respectively
    // w_g = Pipeline Immersed Gravity, A = Pipeline Cross-section Area
    var pipeline: IPipeline;
    var x: number[] = [];
    var z: number[] = [];
    const A: number = Math.PI * (Math.pow(this.parameters.pipelineOuterDiameter/2, 2) - (Math.pow(this.parameters.pipelineOuterDiameter/2 - this.parameters.pipelineWallThickness, 2)));
    const w_g: number = (this.parameters.pipelineDensity - this.parameters.seawaterDensity) * 9.81 * A;

    // deltaS = is the length of each finite difference subinterval
    let deltaS: number = this.parameters.spanLength / this.parameters.finiteDifferenceSubintervalAmount;

    // The first step to the calculations is to get the xz coordinates
    [x, z] = this.calculateXZ(this.parameters, w_g, deltaS);

    // Next we back-calculate the forces acting on the pipeline
    const bendingMoments: number[] = this.getBendingMoments([], deltaS);
    const shearForces: number[] = this.getShearForces(bendingMoments, deltaS);

    //return pipeline;
  }

  private getThetaValue(s:number): number {
    let thetaValue: number = 0;
    return thetaValue;
  }

  private calculateXZ(parameters: IPipelineParameters, w_g: number, deltaS: number): Array<Array<number>> {
    // Initialising the required variables
    // x and y coordinate values
    let xVals: number[] = [];
    let zVals: number[] = [];
    
    let embedment: number = w_g / parameters.seafloorStiffness;

    return [xVals, zVals];
  }

  private getBendingMoments(thetaValues: number[], deltaS: number): number[] {
    // E = Pipeline's elasticity modulus, I = Pipeline's moment of inertia
    var E = this.parameters.pipelineElasticityModulus;
    var I = Math.PI / (4 * ((this.parameters.pipelineOuterDiameter/2)^4 - (this.parameters.pipelineOuterDiameter/2 - this.parameters.pipelineWallThickness)^4));
    var bendingMoments: number[] = [];
    for (let i = 1; i < thetaValues.length; i++) {
      let M = E * I * ((thetaValues[i] - thetaValues[i-1])/deltaS);
      bendingMoments.push(M);
    }
    return bendingMoments;
  }

  private getShearForces(bendingMoments: number[], deltaS: number): number[] {
    var shearForces: number[] = [];
    for (let i = 1; i < bendingMoments.length; i++) {
      let S = (bendingMoments[i] - bendingMoments[i-1]) / deltaS;
      shearForces.push(S);
    }
    return shearForces;
  }

  private getAxialTension() {

  }

  // Takes an array of IPipeline and returns the most optimal buoyancy section length
  private findOptimalLength(pipelines: IPipeline[]): number { 
    return 0;
  }


  // Takes an IPipeline object as input and returns an array of its max forces
  private findMaxForces(pipeline: IPipeline): number[] {
    // Defining all the max forces
    let minElevationGap: number = Math.max(...pipeline.elevationValues) - Math.min(...pipeline.elevationValues);
    let minBendingDifference: number = Math.max(...pipeline.bendingMoments) - Math.abs(Math.min(...pipeline.bendingMoments));
    let maxShearForce: number = Math.max(...pipeline.shearForces);
    let maxAxialTension: number = Math.max(...pipeline.axialTensionForces);

    // Returning max forces in an array
    return [minElevationGap, minBendingDifference, maxShearForce, maxAxialTension];
  }


}
