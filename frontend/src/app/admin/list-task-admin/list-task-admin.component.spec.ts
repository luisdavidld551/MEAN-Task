import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTaskAdminComponent } from './list-task-admin.component';

describe('ListTaskAdminComponent', () => {
  let component: ListTaskAdminComponent;
  let fixture: ComponentFixture<ListTaskAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTaskAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTaskAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
