import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimplecastComponent } from './simplecast.component';

describe('SimplecastComponent', () => {
  let component: SimplecastComponent;
  let fixture: ComponentFixture<SimplecastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimplecastComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimplecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
