import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorkspaceComponent } from './workspace.component';

describe('CreateWorkspaceComponent', () => {
  let component: CreateWorkspaceComponent;
  let fixture: ComponentFixture<CreateWorkspaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateWorkspaceComponent]
    });
    fixture = TestBed.createComponent(CreateWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
