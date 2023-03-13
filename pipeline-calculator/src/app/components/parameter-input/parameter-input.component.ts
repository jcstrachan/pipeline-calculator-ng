import { Component, Output, EventEmitter  } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { IPipelineParameters } from 'src/app/interfaces/pipeline-parameters';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-parameter-input',
  templateUrl: './parameter-input.component.html',
  styleUrls: ['./parameter-input.component.css']
})
export class ParameterInputComponent {

  @Output() parameterEmitter = new EventEmitter();

  public parametersForm = new FormGroup({
    thetaFunction: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    pipelineArcLength: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    finiteDifferenceSubintervalAmount: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    pipelineOuterDiameter: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    pipelineWallThickness: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    pipelineElasticityModulus: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    pipelineDensity: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    seawaterDensity: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    spanLength: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    elevationGap: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required]}),
    spanShoulderLength: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    seafloorStiffness: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(1)]})
  });

  onSubmit() {
    console.warn(this.parametersForm.value);
    var parameters: IPipelineParameters = {
      thetaFunction: this.parametersForm.value.thetaFunction?.trim() || '',
      pipelineArcLength: this.parametersForm.value.pipelineArcLength || 0,
      finiteDifferenceSubintervalAmount: this.parametersForm.value.finiteDifferenceSubintervalAmount || 0,
      pipelineOuterDiameter: this.parametersForm.value.pipelineOuterDiameter || 0,
      pipelineWallThickness: this.parametersForm.value.pipelineWallThickness || 0,
      pipelineElasticityModulus: this.parametersForm.value.pipelineElasticityModulus || 0,
      pipelineDensity: this.parametersForm.value.pipelineDensity || 0,
      seawaterDensity: this.parametersForm.value.seawaterDensity || 0,
      spanLength: this.parametersForm.value.spanLength || 0,
      elevationGap: this.parametersForm.value.elevationGap || 0,
      spanShoulderLength: this.parametersForm.value.spanShoulderLength || 0,
      seafloorStiffness: this.parametersForm.value.seafloorStiffness || 0
    }
    this.parameterEmitter.emit(parameters);
  }

}
