import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidExportDialogComponent } from './invalid-export-dialog.component';

describe('InvalidExportDialogComponent', () => {
  let component: InvalidExportDialogComponent;
  let fixture: ComponentFixture<InvalidExportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvalidExportDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvalidExportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
