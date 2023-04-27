import { Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent {

  @Input() data: number[][] = [];
  @Input() xAxisName: string = 'Length of buoyancysection (m)';
  @Input() yAxisName: string = '';

  chartOption: EChartsOption = {};
  
  ngOnChanges(changes: SimpleChanges) {
      this.updateChart()
  }

  private updateChart() {
    this.chartOption = {
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
        nameLocation: 'middle',
        nameGap: 25,
        nameTextStyle: {
          color: '#333333'
        }
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
        nameLocation: 'middle',
        nameGap: 25,
        nameTextStyle: {
          color: '#333333'
        }
      },
      series: [
        {
          type: 'line',
          showSymbol: false,
          smooth: true,
          clip: true,
          data: this.data
        }
      ]
    };
  }
  
}
