import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContentCheckComponent } from './dialog-content-check.component';

describe('DialogContentCheckComponent', () => {
  let component: DialogContentCheckComponent;
  let fixture: ComponentFixture<DialogContentCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogContentCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogContentCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
