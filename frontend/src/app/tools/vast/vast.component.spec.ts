import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VastComponent } from './vast.component';

describe('VastComponent', () => {
  let component: VastComponent;
  let fixture: ComponentFixture<VastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VastComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
