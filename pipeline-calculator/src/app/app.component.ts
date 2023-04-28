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
  public pipelineResults: IPipeline[] = [];
  public deltaS!: number;

  public updateParameters(event: IPipelineParameters) {
    this.parameters = event;
    this.pipelineResults = this.calculatePipelines();
  }

  private calculatePipelines(): IPipeline[] {
    // Initialising the required variable
    // x and z are arrays of node positions in the x and z axis respectively
    // w_g = Pipeline Immersed Gravity, A = Pipeline Cross-section Area
    let pipelines: IPipeline[] = [];
    const A: number = Math.PI * (Math.pow(this.parameters.pipelineOuterDiameter/2, 2) - (Math.pow(this.parameters.pipelineOuterDiameter/2 - this.parameters.pipelineWallThickness, 2)));
    const w_g: number = (this.parameters.pipelineDensity - this.parameters.seawaterDensity) * 9.81 * A;

    // deltaS = is the length of each finite difference subinterval
    this.deltaS = this.parameters.spanLength / this.parameters.finiteDifferenceSubintervalAmount;

    
    for (let l = 40; l <= 80; l++) {
      // The first step to the calculations is to get the theta values and z coordinates
      const thetaValues = this.getThetaValues(this.deltaS, l);
      let xzVals: number[][] = this.calculateXZ(w_g, this.deltaS, l);

      // Next we back-calculate the forces acting on the pipeline
      const bendingMoments: number[] = this.getBendingMoments(thetaValues, this.deltaS);
      const shearForces: number[] = this.getShearForces(bendingMoments, this.deltaS);

      let pipeline: IPipeline = {
        buoyancySectionLength: l,
        coordinates: xzVals,
        bendingMoments: bendingMoments,
        shearForces: shearForces,
        axialTensionForces: [],
        supportReactions: [],
      }
      pipelines.push(pipeline);
    }

    return pipelines;

  }

  // Function to generate a curve to represent a possible pipeline
  // Note that this curve is an estimation as discussed in the report and user manual
  private getThetaValues(deltaS: number, l: number): number[] {
    // First we need to define our 'a' value to determine the amplitude
    const a = -1.6 + (l - 40)/10;
    const thetaValues: number[] = []

    let x = 0;
    let slope, angle;

    while (x <= this.parameters.spanLength) {
      // First step is to calculate the slope at the current x 
      slope = -a * 0.5 * (x-3) * Math.exp(-((0.5 * (x-3))**2)) + 1.2 * 0.4 * ((0.3 * (x - 3)) ** 3) * Math.exp(-((0.3 * (x-3))**4));

      // Next we can calculate the angle between the curve and the x-axis, taking into account if it is negative
      angle = Math.atan(slope);
      if (slope < 0) {
        angle += Math.PI;
      }

      // Finally, we add it to the array of theta angles and increment our x value
      thetaValues.push(angle);
      x += deltaS;
    }
    
    return thetaValues;
  }

  private calculateXZ(w_g: number, deltaS: number, l: number): number[][] {
    // Initialising required variables
    const a = -1.6 + (l - 40)/10;
    let xzVals: number[][] = [];
    let x = 0;
    
    while (x <= this.parameters.spanLength) {
      // We calculate the z value at the current x and push it to the array
      xzVals.push([x * 8.3, (a * Math.exp(-((0.5 * (x - 6))**2)) - 0.4 * Math.exp(-((0.3 * (x - 6))**4))) * 2]);
      // Then we increment the x value
      x += deltaS;
    }

    return xzVals;
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

  private getAxialTension(thetaValues: number[]) {
    // Calculate the axial tension at each interval
    var axialTensions: number[] = [];
    for (let i = 1; i < (this.parameters.spanLength/this.parameters.finiteDifferenceSubintervalAmount); i++) {
      // First step is to calculate the sum of the node seafloor support reactions minus 
      this.parameters.effectiveAxialTension * Math.cos(thetaValues[i])
    }
  }


  // Takes an IPipeline object as input and returns an array of its max forces
  private findMaxForces(pipeline: IPipeline): number[] {
    // Defining all the max forces
    let zVals: number[] = [];
    for (let i = 0; i < pipeline.coordinates.length; i++) {
      zVals.push(pipeline.coordinates[i][1]);
    }
    let minElevationGap: number = Math.max(...zVals) - Math.min(...zVals);
    let minBendingDifference: number = Math.max(...pipeline.bendingMoments) - Math.abs(Math.min(...pipeline.bendingMoments));
    let maxShearForce: number = Math.max(...pipeline.shearForces);
    let maxAxialTension: number = Math.max(...pipeline.axialTensionForces);

    // Returning max forces in an array
    return [minElevationGap, minBendingDifference, maxShearForce, maxAxialTension];
  }


}
