import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceDetailComponent } from './workspace-detail.component';

describe('WorkspaceDetailComponent', () => {
  let component: WorkspaceDetailComponent;
  let fixture: ComponentFixture<WorkspaceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkspaceDetailComponent]
    });
    fixture = TestBed.createComponent(WorkspaceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
