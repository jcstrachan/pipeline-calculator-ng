import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { render } from 'react-dom';
import { SubmitDialogComponent } from './dialogues/submit-dialog/submit-dialog.component';
import { ParameterErrorDialogComponent } from './dialogues/parameter-error-dialog/parameter-error-dialog.component';
import { IPipelineParameters } from './interfaces/pipeline-parameters';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        MatDialogModule,
      ],
      providers: [
        { provide: MatDialog, useValue: { open: jest.fn() } }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should call submitDialog and calculatePipelines with the new parameters', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    const spySubmitDialog = jest.spyOn(component, 'submitDialog');
    const spyCalculatePipelines = jest.spyOn(component, 'calculatePipelines');

    const newParams: IPipelineParameters = {
      finiteDifferenceSubintervalAmount: 1,
      pipelineOuterDiameter: 2,
      pipelineWallThickness: 3,
      pipelineElasticityModulus: 4,
      pipelineDensity: 5,
      seawaterDensity: 6,
      spanLength: 7,
      elevationGap: 8,
      spanShoulderLength: 9,
      effectiveAxialTension: 10,
      seafloorStiffness: 11,
    };

    component.updateParameters(newParams);

    expect(spySubmitDialog).toHaveBeenCalledTimes(1);
    expect(component.parameters).toEqual(newParams);
    expect(spyCalculatePipelines).toHaveBeenCalledTimes(1);
  });

  it('should get the correct shear forces', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    const bendingMoments: number[] = [0, 0.2, 0.24, 0.5, 0.57, 0.7, 0.61, 0.49, 0.23, 0.17, 0];
    const deltaS: number = 0.25;
    const expectedOutput: number[] = [-0.8, -0.15999999999999992, -1.04, -0.2799999999999998, -0.52, 0.3599999999999999, 0.48, 1.04, 0.24, 0.68];

    const result = component.getShearForces(bendingMoments, deltaS);
    expect(result).toEqual(expectedOutput);
  });

  it('should open the correct submit dialog', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    const dialog: MatDialog = TestBed.inject(MatDialog);
    component.submitDialog();
    expect(dialog.open).toHaveBeenCalledWith(SubmitDialogComponent);
  });

  it('should open ParameterErrorDialogComponent when event is falsy or pipelineResults is empty', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    const dialog: MatDialog = TestBed.inject(MatDialog);
    const event = new Event('click');

    component.exportData(event);

    expect(dialog.open).toHaveBeenCalledWith(ParameterErrorDialogComponent);
  });

});
  