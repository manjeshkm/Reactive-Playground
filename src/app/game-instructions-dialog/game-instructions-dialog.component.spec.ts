
import { GameInstructionsDialogComponent } from './game-instructions-dialog.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

describe('GameInstructionsDialogComponent', () => {
  let component: GameInstructionsDialogComponent;
  let fixture: ComponentFixture<GameInstructionsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameInstructionsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameInstructionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
