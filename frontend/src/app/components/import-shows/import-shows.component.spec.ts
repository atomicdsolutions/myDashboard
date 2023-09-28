import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportShowsComponent } from './import-shows.component';

describe('ImportShowsComponent', () => {
  let component: ImportShowsComponent;
  let fixture: ComponentFixture<ImportShowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportShowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportShowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
