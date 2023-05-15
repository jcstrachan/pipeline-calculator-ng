import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ExportSettingsComponent } from './export-settings.component';
import { IPipeline } from 'src/app/interfaces/pipeline';
import { EventEmitter } from '@angular/core';
import { InvalidExportDialogComponent } from '../../dialogues/invalid-export-dialog/invalid-export-dialog.component';
import { ExportDialogComponent } from '../../dialogues/export-dialog/export-dialog.component';


class MockEventEmitter extends EventEmitter<any> {
  constructor() {
    super();
  }
}

const mockECharts = {
  init: jest.fn(),
  Axis: {},
  ChartView: {},
  ComponentModel: {},
  ComponentView: {}
};

type MockedECharts = typeof mockECharts & typeof import('echarts');

describe('ExportSettingsComponent', () => {
  let component: ExportSettingsComponent;
  let fixture: ComponentFixture<ExportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportSettingsComponent ],
      imports: [
        MatDialogModule
      ],
      providers: [
        { provide: MatDialog, useValue: { open: jest.fn() } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit a true value from exportData', () => {
    const fixture = TestBed.createComponent(ExportSettingsComponent);
    const component = fixture.componentInstance;
    const emitMock = jest.fn();
    component.exportEmitter = new MockEventEmitter();
    component.exportEmitter.emit = emitMock;

    component.exportData();

    expect(emitMock).toHaveBeenCalledWith(true);
  });

  it('should call updateDownloadOptions and toggle the download option', () => {
    const fixture = TestBed.createComponent(ExportSettingsComponent);
    const component = fixture.componentInstance;
  
    component.downloadOptions = [false, false, false];
    component.updateDownloadOptions(1); 
    expect(component.downloadOptions[1]).toBe(true);
    component.updateDownloadOptions(1);
    expect(component.downloadOptions[1]).toBe(false);
  });

  it('should generate JSON with no errors', async () => {
    const fixture = TestBed.createComponent(ExportSettingsComponent);
    const component = fixture.componentInstance;
    const createObjectURLMock = jest.fn();
    const revokeObjectURLMock = jest.fn();
    URL.createObjectURL = createObjectURLMock;
    URL.revokeObjectURL = revokeObjectURLMock;
    const pipelines: IPipeline[] = [
      {
        buoyancySectionLength: 5,
        coordinates: [[12,43], [21,12]],
        bendingMoments: [12,34,1],
        shearForces: [12,43,21],
        axialTensionForces: [12,43,21],
        supportReactions: [12,43,53]
      }
    ];
    expect(() => {
      component.exportJSON(pipelines);
    }).not.toThrow();

  });

  it('should return an array of xy coordinate pairs based on input values', () => {
    const fixture = TestBed.createComponent(ExportSettingsComponent);
    const component = fixture.componentInstance;
    const yVals = [100000, 200000, 300000, 400000, 500000];
    const divFactor = 100000000;
    const deltaS = 10;

    const result = component.genCoords(yVals, deltaS, divFactor);
 
    expect(result).toEqual([[0, 0.001], [10, 0.002], [20, 0.003], [30, 0.004], [40, 0.005]]);
  });

  it('should call exportJSON and exportPDF if the export option is selected', async () => {
    const fixture = TestBed.createComponent(ExportSettingsComponent);
    const component = fixture.componentInstance;
    const pipelines: IPipeline[] = [
      {
        buoyancySectionLength: 5,
        coordinates: [[12,43], [21,12]],
        bendingMoments: [12,34,1],
        shearForces: [12,43,21],
        axialTensionForces: [12,43,21],
        supportReactions: [12,43,53]
      }
    ];
    const deltaS = 0.5;

    const exportJSON = jest.fn();
    const exportPDF = jest.fn();
    const dialog: MatDialog = TestBed.inject(MatDialog);

    component.exportJSON = exportJSON;
    component.exportPDF = exportPDF;

    component.downloadOptions = [true, true, false];

    await component.beginExport(pipelines, deltaS);

    expect(dialog.open).toHaveBeenCalledWith(ExportDialogComponent);
    expect(component.exportJSON).toHaveBeenCalledWith(pipelines);
    expect(component.exportPDF).toHaveBeenCalledWith(pipelines, deltaS);
  });

  it('should show export settings error', async () => {
    const fixture = TestBed.createComponent(ExportSettingsComponent);
    const component = fixture.componentInstance;
    const pipelines: IPipeline[] = [
      {
        buoyancySectionLength: 5,
        coordinates: [[12,43], [21,12]],
        bendingMoments: [12,34,1],
        shearForces: [12,43,21],
        axialTensionForces: [12,43,21],
        supportReactions: [12,43,53]
      }
    ];
    const deltaS = 0.5;
    const dialog: MatDialog = TestBed.inject(MatDialog);
    component.downloadOptions = [false, false, false];

    component.beginExport(pipelines, deltaS);
    expect(dialog.open).toHaveBeenCalledWith(InvalidExportDialogComponent);
  });

  it('getChartOption should return an ECharts option object with the correct properties', () => {
    const fixture = TestBed.createComponent(ExportSettingsComponent);
    const component = fixture.componentInstance;
    const data = [[0, 1], [1, 2], [2, 3]];
    const yAxisName = 'Test Y Axis';
    const yLimits = [0, 10];
    const length = 10
  
    const result = component.getChartOption(data, yAxisName, yLimits, length);

    expect(result).toEqual({
      animation: false,
      grid: {
        top: 40,
        left: 50,
        right: 40,
        bottom: 50
      },
      xAxis: {
        name: 'Length of buoyancy section (m)',
        min: 0,
        max: 200,
        minorTick: {
          show: true
        },
        minorSplitLine: {
          show: true
        },
        nameLocation: 'middle',
        nameGap: 25,
        nameTextStyle: {
          color: '#333333'
        },
        axisLabel: {
          fontSize: 16
        }
      },
      yAxis: {
        name: yAxisName,
        min: yLimits[0],
        max: yLimits[1],
        minorTick: {
          show: true
        },
        minorSplitLine: {
          show: true
        },
        nameLocation: 'middle',
        nameGap: 25,
        nameTextStyle: {
          color: '#333333'
        },
        axisLabel: {
          fontSize: 16
        }
      },
      title: {
        text: 'Buoyancy Section Length: ' + String(length),
        textStyle: {
          fontWeight: 'normal'
        }
      },
      series: [
        {
          type: 'line',
          showSymbol: false,
          smooth: true,
          clip: true,
          data: data,
          label: {
            fontSize: 16
          }
        }
      ]
    });
  });

});
