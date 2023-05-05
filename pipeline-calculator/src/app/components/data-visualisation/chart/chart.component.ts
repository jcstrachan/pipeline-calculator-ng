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
  xAxisName: string = 'Length of buoyancysection (m)';

  chartOption: echarts.EChartsOption = {};
  
  ngOnChanges(changes: SimpleChanges) {
    this.updateChart(changes['data'].currentValue);
  }

  private updateChart(newData: any) {
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
      ]
    };

  }

  public getURL(): string {
    console.log("Getting chart for yaxis: ", this.yAxisName);

    const chartElement = document.getElementById('chart') as HTMLElement;
    const chart = echarts.init(chartElement);
    var dataURL: string = '';

    chart.on('finished', () => {
      dataURL = chart.getDataURL({ type: 'png', pixelRatio: 2});
      console.log(dataURL);
    });

    chart.setOption(this.chartOption);

    
    return dataURL;
  }
  
}
