import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataVisualisationComponent } from './data-visualisation.component';
import { IPipeline } from 'src/app/interfaces/pipeline';
import { IMaxForces } from 'src/app/interfaces/max-forces';

describe('DataVisualisationComponent', () => {
  let component: DataVisualisationComponent;
  let fixture: ComponentFixture<DataVisualisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataVisualisationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataVisualisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update data for buoyancy section length', async () => {
    const fixture = TestBed.createComponent(DataVisualisationComponent);
    const component = fixture.componentInstance;
    const l = 0;
    component.maxForces = {
      maxMinElevation: [[1, 2], [2, 3]],
      maxMinBendingMoments: [[3, 4], [4, 5]],
      maxShearForces: [5, 6]
    };

    await component.updateData(l);

    expect(component.yAxisNames).toEqual([
      'Max/min elevation (m)',
      'Max abs. bending moment (N*m)*10^7',
      'Max shear force (N)*10^5',
      'Axial tension force (N)*10^4'
    ]);
    expect(component.yLimits).toEqual([
      [-15, 10],
      [0, 2.5],
      [2, 8],
      [0, 12]
    ]);
    expect(component.xLimits).toEqual([0, 100]);
    expect(component.data[0]).toEqual(component.genCoords([1, 2], 0, 1));
    expect(component.data[1]).toEqual(component.genCoords([3, 4], 0, 1));
    expect(component.data[2]).toEqual(component.genCoords([5, 6], 0, 1));
  });

  it('should update data for pipeline', async () => {
    const fixture = TestBed.createComponent(DataVisualisationComponent);
    const component = fixture.componentInstance;
    const l = 100;
    component.pipelines = [{ 
        buoyancySectionLength: 50,       
        coordinates: [[15, 18], [14, 16]],
        bendingMoments: [9, 10],
        shearForces: [11, 12],
        axialTensionForces: [13, 14],
        supportReactions: []
      },
      {
        buoyancySectionLength: 100,
        coordinates: [[15, 18], [14, 16]],
        bendingMoments: [17, 18],
        shearForces: [19, 20],
        axialTensionForces: [21, 22],
        supportReactions: []
      }
    ];
    component.deltaS = 1;

    await component.updateData(l);

    expect(component.yAxisNames).toEqual([
      'Elevation (m)',
      'Bending moment (N*m)*10^7',
      'Shear force (N)*10^5',
      'Axial tension force (N)*10^4'
    ]);
    expect(component.yLimits).toEqual([
      [-5, 5],
      [-2, 2],
      [-5, 5],
      [-1, 2.5]
    ]);
    expect(component.xLimits).toEqual([0, 200]);
    expect(component.data[0]).toEqual([[15, 18], [14, 16]]);
    expect(component.data[1]).toEqual(component.genCoords([17, 18], 100000000000, 1));
    expect(component.data[2]).toEqual(component.genCoords([19, 20], 10000000000, 1));
  });

  it('should return an array of xy coordinate pairs based on input values', () => {
    const fixture = TestBed.createComponent(DataVisualisationComponent);
    const component = fixture.componentInstance;
    const yVals = [100000, 200000, 300000, 400000, 500000];
    const divFactor = 100000000;
    const deltaX = 10;

    const result =component. genCoords(yVals, divFactor, deltaX);

    expect(result).toEqual([[0, 0.001], [10, 0.002], [20, 0.003], [30, 0.004], [40, 0.005]]);
  });

});

