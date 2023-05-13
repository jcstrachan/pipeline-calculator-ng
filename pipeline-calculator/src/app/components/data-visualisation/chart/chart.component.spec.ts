import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ChartComponent } from './chart.component';
import { SimpleChanges } from '@angular/core';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;
  let updateChartSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    updateChartSpy = jest.spyOn(component, 'updateChart');
    fixture.detectChanges();
  });

  afterEach(() => {
    updateChartSpy.mockClear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a chart in a div', () => {
    expect(fixture.debugElement.query(By.css('.chart')));
  })

  it('should call updateChart with the correct argument when data changes', () => {
    const data = {};
    const changes: SimpleChanges = {
      data: {
        currentValue: data,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true,
      },
    };    

    component.ngOnChanges(changes);

    expect(updateChartSpy).toHaveBeenCalledWith(data);
  });

});
