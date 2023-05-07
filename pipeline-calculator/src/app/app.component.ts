import { Component, ViewChild  } from '@angular/core';
import { IPipelineParameters } from './interfaces/pipeline-parameters';
import * as numeric from 'numeric';
import { IPipeline } from './interfaces/pipeline';
import { DataVisualisationComponent } from './components/data-visualisation/data-visualisation.component';
import jsPDF from 'jspdf';
import { ExportSettingsComponent } from './components/export-settings/export-settings.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PBMC';
  public parameters!: IPipelineParameters;
  public pipelineResults: IPipeline[] = [];
  public deltaS!: number;

  public updateParameters(event: IPipelineParameters) {
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

  public calculateXZ(w_g: number, deltaS: number, l: number): number[][] {
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

  public getAxialTension(thetaValues: number[]) {
    // Calculate the axial tension at each interval
    var axialTensions: number[] = [];
    for (let i = 1; i < (this.parameters.spanLength/this.parameters.finiteDifferenceSubintervalAmount); i++) {
      // First step is to calculate the sum of the node seafloor support reactions minus 
      this.parameters.effectiveAxialTension * Math.cos(thetaValues[i])
    }
  }


  // Takes an IPipeline object as input and returns an array of its max forces
  public findMaxForces(pipeline: IPipeline): number[] {
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

  @ViewChild(ExportSettingsComponent, {static: false}) exportSettings!: ExportSettingsComponent;

  public async exportData(event: Event) {
    if (event) {

      this.exportSettings.beginExport(this.pipelineResults, this.deltaS);

    }

    // let chartURLs: string[] = await this.dataComponent.getURLs();

    //   const doc = new jsPDF();
    //   doc.setFontSize(16);
    //   doc.text('Pipeline Buoyancy Module Calculator', 10, 20);

    //   doc.setFontSize(12);
    //   var lines = doc.splitTextToSize('The first step is to calculate the theta function, for the purposes of this proof of concept, these values were estimated. Once the theta function has been defined, the coordinates and forces acting on the pipeline can be calculated.', 180);
    //   doc.text(lines, 10, 35);

    //   lines = doc.splitTextToSize('First, we will display the graphs for the elevation of each buoyancy section: ', 180);
    //   doc.text(lines, 10, 50)
    //   doc.addImage(chartURLs[0], 'PNG', 10, 50, 40, 40);
    //   doc.addImage(chartURLs[1], 'PNG', 50, 50, 40, 40);
    //   doc.addImage(chartURLs[2], 'PNG', 90, 50, 40, 40);
    //   doc.addImage(chartURLs[3], 'PNG', 130, 50, 40, 40);
    //   doc.addImage(chartURLs[4], 'PNG', 170, 50, 40, 40);
    //   doc.save('file.pdf')


  }


}
