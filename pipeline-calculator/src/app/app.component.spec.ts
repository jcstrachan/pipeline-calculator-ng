import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { render } from 'react-dom';
import { SubmitDialogComponent } from './dialogues/submit-dialog/submit-dialog.component';
import { ParameterErrorDialogComponent } from './dialogues/parameter-error-dialog/parameter-error-dialog.component';

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

  it('should get the correct shear forces', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const bendingMoments: number[] = [0, 0.2, 0.24, 0.5, 0.57, 0.7, 0.61, 0.49, 0.23, 0.17, 0];
    const deltaS: number = 0.25;
    const expectedOutput: number[] = [-0.8, -0.15999999999999992, -1.04, -0.2799999999999998, -0.52, 0.3599999999999999, 0.48, 1.04, 0.24, 0.68];

    const result = app.getShearForces(bendingMoments, deltaS);
    expect(result).toEqual(expectedOutput);
  });

  it('should open the correct submit dialog', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const dialog: MatDialog = TestBed.inject(MatDialog);
    app.submitDialog();
    expect(dialog.open).toHaveBeenCalledWith(SubmitDialogComponent);
  });

  it('should open ParameterErrorDialogComponent when event is falsy or pipelineResults is empty', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const dialog: MatDialog = TestBed.inject(MatDialog);
    const event = new Event('click');

    app.exportData(event);

    expect(dialog.open).toHaveBeenCalledWith(ParameterErrorDialogComponent);
  });
});
