import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { IExportData } from 'src/app/interfaces/export-data';
import { IPipeline } from 'src/app/interfaces/pipeline';
import { ChartComponent } from './chart/chart.component';

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
  ]

  yLimits: number[][] = [
    [-5, 5],
    [-1, 1],
    [-5, 5],
    [-1, 2.5]
  ]

  yAxisNames: string[] = [
    'Elevation (m)',
    'Bending moment (N*m)*10^7',
    'Shear force (N)*10^5',
    'Axial tension force (N)*10^4'
  ]

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['_pipelines']) {
      this._pipelines = changes['_pipelines'].currentValue;
      this.updateData(parseInt(this.selectedOption, 10));
    }
  }

  public onSelectionChange(event: MatSelectChange): void {
    this.selectedOption = event.value;
    this.updateData(parseInt(event.value, 10));
  }

  // Update the data variable
  private updateData(l: number): Promise<void> {

    return new Promise<void>((resolve) => {

      //First we need to find the pipeline we want the data from
      const pipe = this.pipelines.find(item => item.buoyancySectionLength === l);

      // Next we assign the coordinates to the first index of the array
      if (pipe) {
        this.data[0] = pipe.coordinates;
        this.data[1] = this.genCoords(pipe.bendingMoments);
        this.data[2] = this.genCoords(pipe.shearForces);
        this.data[3] = this.genCoords(pipe.axialTensionForces);
      }

      resolve();

    })
    
  }

  private genCoords(yVals: number[]): number[][] {
    let xyVals: number[][] = [];
    let x = 0;

    for (let yVal of yVals) {
      xyVals.push([x*18.5, yVal*0.0000000000035]);
      x += this.deltaS;
    }

    return xyVals;
  }

  @ViewChild(ChartComponent, {static: false}) chartComponent!: ChartComponent;

  public async getURLs(): Promise<string[]> {
    // First we need to collect the data for each length of buoyancy section.
    // We will collect data for 40m, 50m, 60m, 70m and 80m
    let URLs: string[] = [];
    for (let length of [40, 50, 60, 70, 80]) {
      const chartURL = await this.getDataAndUpdateChart(length);
      URLs.push(chartURL);
    }
    
    
    console.log(URLs);

    return URLs;
  }

  async getDataAndUpdateChart(length: number) {
    await this.updateData(length);
    return this.chartComponent.getURL();
  }

}
