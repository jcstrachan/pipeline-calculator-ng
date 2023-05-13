import { Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent {

  @Input() data: number[][] = [];
  @Input() yAxisName: string = '';
  @Input() yLimits: number[] = [];
  @Input() xLimits: number[] = [];
  xAxisName: string = 'Length of buoyancy section (m)';

  chartOption: echarts.EChartsOption = {};
  
  ngOnChanges(changes: SimpleChanges) {
    this.updateChart(changes['data'].currentValue);
  }

  public updateChart(newData: any) {
    this.chartOption = {
      grid: {
        top: 40,
        left: 50,
        right: 40,
        bottom: 50
      },
      xAxis: {
        name: this.xAxisName,
        min: this.xLimits[0],
        max: this.xLimits[1],
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
        min: this.yLimits[0],
        max: this.yLimits[1],
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
          data: newData
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'none',
          zoomOnMouseWheel: true,
          moveOnMouseMove: true
        },
        {
          type: 'slider',
          xAxisIndex: 0,
          filterMode: 'none',
          show: false
        }
      ],
      animation: false,
      tooltip: {
        show: false
      }
    };

  }
  
}
