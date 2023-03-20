import { Component } from '@angular/core';

@Component({
  selector: 'app-data-visualisation',
  templateUrl: './data-visualisation.component.html',
  styleUrls: ['./data-visualisation.component.css']
})
export class DataVisualisationComponent {

  data: number[][] = this.generateData();
  xAxisName: string = 'Length of buoyancysection (m)'
  yAxisNames: string[] = ['Max/min elevation (m)', 'Max abs. bending moment (N*m)', 'Max shear force (N)', 'Max axial tension (N)']

  private func(x: number) {
    return -Math.cos(0.03*x) * 20;
  }
  
  private generateData() {
    let data = [];
    for (let i = -100; i <= 100; i += 0.1) {
      data.push([i, this.func(i)]);
    }
    return data;
  }

}
