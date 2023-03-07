import { Component, Output, EventEmitter  } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { IPipelineParameters } from 'src/app/interfaces/pipeline-parameters';

@Component({
  selector: 'app-parameter-input',
  templateUrl: './parameter-input.component.html',
  styleUrls: ['./parameter-input.component.css']
})
export class ParameterInputComponent {

  @Output() parameterEmitter = new EventEmitter();

  public parametersForm = new FormGroup({
    thetaS: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    pipelineOuterDiameter: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    pipelineWallThickness: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    pipelineElasticityModulus: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    pipelineDensity: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    seawaterDensity: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    spanLength: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    elevationGap: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    spanShoulderLength: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    seawaterStiffness: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(1)]})
  });

  onSubmit() {
    console.warn(this.parametersForm.value);
    var parameters: IPipelineParameters = {
      thetaS: this.parametersForm.value.thetaS?.trim() || '',
      pipelineOuterDiameter: this.parametersForm.value.pipelineOuterDiameter || 0,
      pipelineWallThickness: this.parametersForm.value.pipelineWallThickness || 0,
      pipelineElasticityModulus: this.parametersForm.value.pipelineElasticityModulus || 0,
      pipelineDensity: this.parametersForm.value.pipelineDensity || 0,
      seawaterDensity: this.parametersForm.value.seawaterDensity || 0,
      spanLength: this.parametersForm.value.spanLength || 0,
      elevationGap: this.parametersForm.value.elevationGap || 0,
      spanShoulderLength: this.parametersForm.value.spanShoulderLength || 0,
      seawaterStiffness: this.parametersForm.value.seawaterStiffness || 0
    }
    this.parameterEmitter.emit(parameters);
  }

}
