import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustombtnComponent } from './custombtn.component';

describe('CustombtnComponent', () => {
  let component: CustombtnComponent;
  let fixture: ComponentFixture<CustombtnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustombtnComponent]
    });
    fixture = TestBed.createComponent(CustombtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
