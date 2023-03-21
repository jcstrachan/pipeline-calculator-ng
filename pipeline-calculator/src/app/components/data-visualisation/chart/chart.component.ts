import { Component, Input } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent {

  @Input() data: number[][] = [];
  @Input() xAxisName: string = '';
  @Input() yAxisName: string = '';
  
  chartOption: EChartsOption = {
    animation: false,
    grid: {
      top: 40,
      left: 50,
      right: 40,
      bottom: 50
    },
    xAxis: {
      name: this.xAxisName,
      min: 0,
      max: 100,
      minorTick: {
        show: true
      },
      minorSplitLine: {
        show: false
      },
      nameLocation: 'middle'
    },
    yAxis: {
      name: this.yAxisName,
      min: -15,
      max: 15,
      minorTick: {
        show: true
      },
      minorSplitLine: {
        show: false
      },
      nameLocation: 'middle'
    },
    series: [
      {
        type: 'line',
        showSymbol: false,
        clip: true,
        data: this.data
      }
    ]
  };
}