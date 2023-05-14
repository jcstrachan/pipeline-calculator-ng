import { Component, ViewChild  } from '@angular/core';
import { IPipelineParameters } from './interfaces/pipeline-parameters';
import { IPipeline } from './interfaces/pipeline';
import { ExportSettingsComponent } from './components/export-settings/export-settings.component';
import { MatDialog } from '@angular/material/dialog';
import { ParameterErrorDialogComponent } from './dialogues/parameter-error-dialog/parameter-error-dialog.component';
import { SubmitDialogComponent } from './dialogues/submit-dialog/submit-dialog.component';
import { IMaxForces } from './interfaces/max-forces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor (public dialog: MatDialog) {}

  title = 'PBMC';
  public parameters!: IPipelineParameters;
  public pipelineResults: IPipeline[] = [];
  public deltaS!: number;

  public updateParameters(event: IPipelineParameters) {
    this.submitDialog();
    this.parameters = event;
    this.pipelineResults = this.calculatePipelines();
  }

  public calculatePipelines(): IPipeline[] {
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
      let xzVals: number[][] = this.calculateXZ(this.deltaS, l);

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

    var jsonData = JSON.stringify(pipelines);
    console.log(jsonData)

    return pipelines;

  }

  // Function to generate a curve to represent a possible pipeline
  // Note that this curve is an estimation as discussed in the report and user manual
  public getThetaValues(deltaS: number, l: number): number[] {
    // First we need to define our 'a' value to determine the amplitude
    const a = -1.6 + (l - 40)/10;
    const thetaValues: number[] = []

    let x = 0;

    while (x <= this.parameters.spanLength) {
      // First step is to calculate the slope at the current x, then convert it into an angle
      let slope = -0.1 * a * (x/10 - 0.5) * Math.exp(-0.25 * ((x/20) - 5)**2) - 1.2 * a * (x/20 - 2.5)**3 * Math.exp(-0.09 * ((x/20) - 5)**4);
      let angle = Math.atan(slope) * 180 / Math.PI;

      // Finally, we add it to the array of theta angles and increment our x value
      thetaValues.push(angle);
      x += deltaS;
    }
    
    return thetaValues;
  }

  public calculateXZ(deltaS: number, l: number): number[][] {
    // Initialising required variables
    const a = -1.6 + (l - 40)/10;
    let xzVals: number[][] = [];
    let x = 0;
    
    while (x <= this.parameters.spanLength) {
      // We calculate the z value at the current x and push it to the array
      xzVals.push([x, a * Math.exp(-((0.5 * ((x/20) - 5))**2)) - 0.4 * Math.exp(-((0.3 * ((x/20) - 5))**4))]);
      // Then we increment the x value
      x += deltaS;
    }

    return xzVals;
  }

  public getBendingMoments(thetaValues: number[], deltaS: number): number[] {
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

  public getShearForces(bendingMoments: number[], deltaS: number): number[] {
    var shearForces: number[] = [];
    for (let i = 1; i < bendingMoments.length; i++) {
      let S = -(bendingMoments[i] - bendingMoments[i-1]) / deltaS;
      shearForces.push(S);
    }
    return shearForces;
  }

  // public getAxialTension(thetaValues: number[]) {
  //   // Calculate the axial tension at each interval
  //   var axialTensions: number[] = [];
  //   for (let i = 1; i < (this.parameters.spanLength/this.parameters.finiteDifferenceSubintervalAmount); i++) {
  //     // First step is to calculate the sum of the node seafloor support reactions minus 
  //     this.parameters.effectiveAxialTension * Math.cos(thetaValues[i])
  //   }
  // }

  @ViewChild(ExportSettingsComponent, {static: false}) exportSettings!: ExportSettingsComponent;

  public async exportData(event: Event) {
    if (event && this.pipelineResults.length != 0) {

      this.exportSettings.beginExport(this.pipelineResults, this.deltaS);

    } else {
      this.dialog.open(ParameterErrorDialogComponent);
    }

  }

  submitDialog() {
    this.dialog.open(SubmitDialogComponent);
  }

  downloadManual() {
    const url = '../assets/user_manual.pdf';
    window.open(url, '_blank');
  }

}
