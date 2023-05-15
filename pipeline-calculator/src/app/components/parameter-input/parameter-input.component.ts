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

  // Create a new parameter FormGroup and populate it with configured FormControl instances
  public parametersForm = new FormGroup({
    finiteDifferenceSubintervalAmount: new FormControl<number>(800, {validators: [Validators.required, Validators.min(1)]}),
    pipelineOuterDiameter: new FormControl<number>(1.22, {validators: [Validators.required, Validators.min(1)]}),
    pipelineWallThickness: new FormControl<number>(0.0318, {validators: [Validators.required, Validators.min(0)]}),
    pipelineElasticityModulus: new FormControl<number>(210000000000, {validators: [Validators.required, Validators.min(1)]}),
    pipelineDensity: new FormControl<number>(7850, {validators: [Validators.required, Validators.min(1)]}),
    seawaterDensity: new FormControl<number>(1030, {validators: [Validators.required, Validators.min(1)]}),
    spanLength: new FormControl<number>(200, {validators: [Validators.required, Validators.min(1)]}),
    elevationGap: new FormControl<number>(0, {validators: [Validators.required]}),
    spanShoulderLength: new FormControl<number>(100, {validators: [Validators.required, Validators.min(1)]}),
    effectiveAxialTension: new FormControl<number>(0, {validators: [Validators.required]}),
    seafloorStiffness: new FormControl<number>(4000, {validators: [Validators.required, Validators.min(1)]})
  });

  // Creates a new parameters object and assigns the values in the form to the object
  // Then emits the data for the parent component
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

  // Sets all parameter values to 0
  resetParameters() {
    this.parametersForm.controls['finiteDifferenceSubintervalAmount'].setValue(0);
    this.parametersForm.controls['pipelineOuterDiameter'].setValue(0);
    this.parametersForm.controls['pipelineWallThickness'].setValue(0);
    this.parametersForm.controls['pipelineElasticityModulus'].setValue(0);
    this.parametersForm.controls['pipelineDensity'].setValue(0);
    this.parametersForm.controls['seawaterDensity'].setValue(0);
    this.parametersForm.controls['spanLength'].setValue(0);
    this.parametersForm.controls['elevationGap'].setValue(0);
    this.parametersForm.controls['spanShoulderLength'].setValue(0);
    this.parametersForm.controls['effectiveAxialTension'].setValue(0);
    this.parametersForm.controls['seafloorStiffness'].setValue(0);
  }

}
