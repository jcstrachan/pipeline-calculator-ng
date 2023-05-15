import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { IMaxForces } from 'src/app/interfaces/max-forces';
import { IPipeline } from 'src/app/interfaces/pipeline';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-data-visualisation',
  templateUrl: './data-visualisation.component.html',
  styleUrls: ['./data-visualisation.component.css']
})
export class DataVisualisationComponent implements OnChanges {

  options = [
    {label: '40m', value: '40'},
    {label: '50m', value: '50'},
    {label: '60m', value: '60'},
    {label: '70m', value: '70'},
    {label: '80m', value: '80'},
    {label: 'Max Forces', value: '0'}
  ]

  yAxisNames: string[] = []
  yLimits: number[][] = []
  xLimits: number[] = []

  maxForces!: IMaxForces;

  selectedOption!: string;
  data: number[][][] = [];

  private _pipelines: IPipeline[] = [];
  @Input() public set pipelines(value: IPipeline[]) {
    this._pipelines = value;
  }
  public get pipelines(): IPipeline[] {
    return this._pipelines;
  }
  @Input() deltaS: number = 1;

  // If the pipeline parameters change, this function will be called
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pipelines'].currentValue.length > 0) {
      this.pipelines = changes['pipelines'].currentValue;
      this.maxForces = this.getMaxForces();
      this.updateData(parseInt(this.selectedOption, 10));
    }
  }

  // If the selection option in the HTML file is changed, this will update the selection value
  public onSelectionChange(event: MatSelectChange): void {
    this.selectedOption = event.value;
    this.updateData(parseInt(event.value, 10));
  }

  // Update the data variable
  public updateData(l: number): Promise<void> {

    return new Promise<void>((resolve) => {

      // First determine if it is a buoyancy section length or max forces:
      if (l == 0) {

        // Sets y axis names to the max forces axis names
        this.yAxisNames = [
          'Max/min elevation (m)',
          'Max abs. bending moment (N*m)*10^7',
          'Max shear force (N)*10^5',
          'Axial tension force (N)*10^4'
        ];

        this.yLimits = [
          [-15, 10],
          [0, 2.5],
          [2, 8],
          [0, 12]
        ];

        this.xLimits = [0, 100];

        this.data[0] = this.genCoords(this.maxForces.maxMinElevation[0], 0, 1);
        this.data[1] = this.genCoords(this.maxForces.maxMinBendingMoments[0], 0, 1);
        this.data[2] = this.genCoords(this.maxForces.maxShearForces, 0, 1);

      } else {

        // assigns the normal axis names
        this.yAxisNames = [
          'Elevation (m)',
          'Bending moment (N*m)*10^7',
          'Shear force (N)*10^5',
          'Axial tension force (N)*10^4'
        ];

        this.yLimits = [
          [-5, 5],
          [-2, 2],
          [-5, 5],
          [-1, 2.5]
        ];

        this.xLimits = [0, 200];

        //First we need to find the pipeline we want the data from
        const pipe = this.pipelines.find(item => item.buoyancySectionLength === l);

        // Next we assign the coordinates to the first index of the array
        if (pipe) {
          this.data[0] = pipe.coordinates;
          this.data[1] = this.genCoords(pipe.bendingMoments, 100000000000, this.deltaS);
          this.data[2] = this.genCoords(pipe.shearForces, 10000000000, this.deltaS);
          //this.data[3] = this.genCoords(pipe.axialTensionForces, 0);
        }
      }

      resolve();

    })
    
  }

  // Returns coordinates by assigning an x value to each input y value
  public genCoords(yVals: number[], divFactor: number, deltaS: number): number[][] {
    let xyVals: number[][] = [];
    let x = 0;

    for (let yVal of yVals) {
      xyVals.push([x, yVal/divFactor]);
      x += deltaS;
    }

    return xyVals;
  }

  // Finds the max forces of each pipeline
  public getMaxForces(): IMaxForces {
    var maxForces: IMaxForces;

    // Initialises the arrays
    var maxMinElevation: number[][] = [];
    var maxMinBendingMoments: number[][] = [];
    var maxShearForces: number[] = [];
    //var maxAxialTension: number[] = [];

    // First gets the max forces for a specific pipe then appends it to the max forces arrays
    for (let i = 0; i <= 40; i++) {
      let [maxElevation, minElevation, maxBendingMoment, minAbsBendingMoment, maxShearForce, maxAxialTension] = this.findMaxForces(this.pipelines[i])
      maxMinElevation.push([maxElevation, minElevation]);
      maxMinBendingMoments.push([maxBendingMoment, minAbsBendingMoment]);
      maxShearForces.push(maxShearForce);
      //maxAxialTension.push(maxAxialTension)
    }

    // Creates the object to return
    maxForces = {
      maxMinElevation: maxMinElevation,
      maxMinBendingMoments: maxMinBendingMoments,
      maxShearForces: maxShearForces,
      //maxAxialTension: maxAxialTension
    }

    return maxForces;
  }


  // Takes an IPipeline object as input and returns an array of its max forces
  public findMaxForces(pipeline: IPipeline) {
    // Adding the x coordinate to the z values
    let zVals: number[] = [];
    for (let i = 0; i < pipeline.coordinates.length; i++) {
      zVals.push(pipeline.coordinates[i][1]);
    }

    // Determine the max and/or mine value of each force
    let maxElevation: number = Math.max(...zVals);
    let minElevation: number = Math.min(...zVals);
    let maxBendingMoment: number = Math.max(...pipeline.bendingMoments);
    let minAbsBendingMoment: number = Math.abs(Math.min(...pipeline.bendingMoments));
    let maxShearForce: number = Math.max(...pipeline.shearForces);
    let maxAxialTension: number = Math.max(...pipeline.axialTensionForces);

    // Returning max forces in an array
    return [maxElevation, minElevation, maxBendingMoment, minAbsBendingMoment, maxShearForce, maxAxialTension];
  }

}
