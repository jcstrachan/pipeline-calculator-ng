import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
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
    {label: '40m', value: 40},
    {label: '50m', value: 50},
    {label: '60m', value: 60},
    {label: '70m', value: 70},
    {label: '80m', value: 80},
  ]

  selectedOption!: number;
  data!: number[][];
  xAxisName: string = 'Length of buoyancysection (m)'
  yAxisNames: string[] = ['Max/min elevation (m)', 'Max abs. bending moment (N*m)', 'Max shear force (N)', 'Max axial tension (N)']

  @Input() _pipelines: IPipeline[] = [];
  public get pipelines(): IPipeline[] {
    return this._pipelines;
  }
  public set pipelines(value: IPipeline[]) {
    this._pipelines = value;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['_pipelines']) {
      console.log("Parameters updated!");
      this._pipelines = changes['_pipelines'].currentValue;
      this.updateData();
    }
  }

  public onSelectionChange(event: MatSelectChange) {
    console.log('Selected option: ', event.value);
    this.selectedOption = event.value;
  }

  private updateData() {
    
  }
  

}
