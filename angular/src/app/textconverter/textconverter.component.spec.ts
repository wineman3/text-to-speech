import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextconverterComponent } from './textconverter.component';

describe('TextconverterComponent', () => {
  let component: TextconverterComponent;
  let fixture: ComponentFixture<TextconverterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextconverterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextconverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
