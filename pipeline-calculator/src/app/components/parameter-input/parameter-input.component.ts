import { Component, Output, EventEmitter  } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IPipelineParameters } from 'src/app/interfaces/pipeline-parameters';

@Component({
  selector: 'app-parameter-input',
  templateUrl: './parameter-input.component.html',
  styleUrls: ['./parameter-input.component.css']
})
export class ParameterInputComponent {

  @Output() parameterEmitter = new EventEmitter();

  public parametersForm = new FormGroup({
    finiteDifferenceSubintervalAmount: new FormControl<number>(800, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    pipelineOuterDiameter: new FormControl<number>(1.22, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    pipelineWallThickness: new FormControl<number>(0.0318, {nonNullable: true, validators: [Validators.required, Validators.min(0)]}),
    pipelineElasticityModulus: new FormControl<number>(210000000000, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    pipelineDensity: new FormControl<number>(7850, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    seawaterDensity: new FormControl<number>(1030, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    spanLength: new FormControl<number>(200, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    elevationGap: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required]}),
    spanShoulderLength: new FormControl<number>(100, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    effectiveAxialTension: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required]}),
    seafloorStiffness: new FormControl<number>(4000, {nonNullable: true, validators: [Validators.required, Validators.min(1)]})
  });

  onSubmit() {
    var parameters: IPipelineParameters = {
      finiteDifferenceSubintervalAmount: this.parametersForm.value.finiteDifferenceSubintervalAmount || 0,
      pipelineOuterDiameter: this.parametersForm.value.pipelineOuterDiameter || 0,
      pipelineWallThickness: this.parametersForm.value.pipelineWallThickness || 0,
      pipelineElasticityModulus: this.parametersForm.value.pipelineElasticityModulus || 0,
      pipelineDensity: this.parametersForm.value.pipelineDensity || 0,
      seawaterDensity: this.parametersForm.value.seawaterDensity || 0,
      spanLength: this.parametersForm.value.spanLength || 0,
      elevationGap: this.parametersForm.value.elevationGap || 0,
      spanShoulderLength: this.parametersForm.value.spanShoulderLength || 0,
      effectiveAxialTension: this.parametersForm.value.effectiveAxialTension || 0,
      seafloorStiffness: this.parametersForm.value.seafloorStiffness || 0
    }
    this.parameterEmitter.emit(parameters);
  }

}
