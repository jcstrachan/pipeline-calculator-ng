import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterErrorDialogComponent } from './parameter-error-dialog.component';

describe('ParameterErrorDialogComponent', () => {
  let component: ParameterErrorDialogComponent;
  let fixture: ComponentFixture<ParameterErrorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterErrorDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParameterErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
