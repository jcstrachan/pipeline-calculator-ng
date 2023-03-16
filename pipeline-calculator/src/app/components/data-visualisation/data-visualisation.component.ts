import { Component } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-data-visualisation',
  templateUrl: './data-visualisation.component.html',
  styleUrls: ['./data-visualisation.component.css']
})
export class DataVisualisationComponent {

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

  chartOption: EChartsOption = {
    animation: false,
    grid: {
      top: 40,
      left: 50,
      right: 40,
      bottom: 50
    },
    xAxis: {
      name: 'x',
      min: -100,
      max: 100,
      minorTick: {
        show: true
      },
      minorSplitLine: {
        show: true
      }
    },
    yAxis: {
      name: 'y',
      min: -100,
      max: 100,
      minorTick: {
        show: true
      },
      minorSplitLine: {
        show: true
      }
    },
    series: [
      {
        type: 'line',
        showSymbol: false,
        clip: true,
        data: this.generateData()
      }
    ]
  };
}
