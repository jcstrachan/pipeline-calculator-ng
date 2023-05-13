import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EChartsOption } from 'echarts';
import { ChartComponent } from './chart.component';

describe('ChartComponent', () => {
  let chartOption: EChartsOption;
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a chart in a div', () => {
    expect(fixture.debugElement.query(By.css('.chart')));
  })

  it('should update chartOption with new data', () => {
    const fixture = TestBed.createComponent(ChartComponent);
    const component = fixture.componentInstance;
    const newData: number[] = [1, 2, 3, 4, 5];
    component.updateChart(newData);

    expect(component.chartOption?.series?.[0]?.data).toEqual(newData);
  });

  it('should update chartOption with correct xAxis and yAxis limits', () => {
    const fixture = TestBed.createComponent(ChartComponent);
    const component = fixture.componentInstance;
    const xLimits = [0, 10];
    const yLimits = [-5, 5];
    component.xAxisName = 'X Axis';
    component.yAxisName = 'Y Axis';
    component.xLimits = xLimits;
    component.yLimits = yLimits;

    component.updateChart([]);

    expect(component.chartOption.xAxis.name).toEqual(component.xAxisName);
    expect(component.chartOption.yAxis.name).toEqual(component.yAxisName);
    expect(component.chartOption.xAxis.min).toEqual(xLimits[0]);
    expect(component.chartOption.xAxis.max).toEqual(xLimits[1]);
    expect(component.chartOption.yAxis.min).toEqual(yLimits[0]);
    expect(component.chartOption.yAxis.max).toEqual(yLimits[1]);
  });

});
