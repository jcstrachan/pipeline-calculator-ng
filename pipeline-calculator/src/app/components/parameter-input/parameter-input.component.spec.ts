import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParameterInputComponent } from './parameter-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { IPipelineParameters } from '../../interfaces/pipeline-parameters';

describe('ParameterInputComponent', () => {
  let component: ParameterInputComponent;
  let fixture: ComponentFixture<ParameterInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule ],
      declarations: [ ParameterInputComponent ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParameterInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset all form controls to zero', () => {
    const fixture = TestBed.createComponent(ParameterInputComponent);
    const component = fixture.componentInstance;

    // Set initial values to non-zero numbers
    component.parametersForm.controls['finiteDifferenceSubintervalAmount'].setValue(1);
    component.parametersForm.controls['pipelineOuterDiameter'].setValue(2);
    component.parametersForm.controls['pipelineWallThickness'].setValue(3);
    component.parametersForm.controls['pipelineElasticityModulus'].setValue(3);
    component.parametersForm.controls['pipelineDensity'].setValue(3);
    component.parametersForm.controls['seawaterDensity'].setValue(3);
    component.parametersForm.controls['spanLength'].setValue(3);
    component.parametersForm.controls['elevationGap'].setValue(3);
    component.parametersForm.controls['spanShoulderLength'].setValue(3);
    component.parametersForm.controls['effectiveAxialTension'].setValue(3);
    component.parametersForm.controls['seafloorStiffness'].setValue(3);

    component.resetParameters();

    expect(component.parametersForm.controls['finiteDifferenceSubintervalAmount'].value).toEqual(0);
    expect(component.parametersForm.controls['pipelineOuterDiameter'].value).toEqual(0);
    expect(component.parametersForm.controls['pipelineWallThickness'].value).toEqual(0);
    expect(component.parametersForm.controls['pipelineElasticityModulus'].value).toEqual(0);
    expect(component.parametersForm.controls['pipelineDensity'].value).toEqual(0);
    expect(component.parametersForm.controls['seawaterDensity'].value).toEqual(0);
    expect(component.parametersForm.controls['spanLength'].value).toEqual(0);
    expect(component.parametersForm.controls['elevationGap'].value).toEqual(0);
    expect(component.parametersForm.controls['spanShoulderLength'].value).toEqual(0);
    expect(component.parametersForm.controls['effectiveAxialTension'].value).toEqual(0);
    expect(component.parametersForm.controls['seafloorStiffness'].value).toEqual(0);
  });

});
