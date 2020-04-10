import {combineLatest, fromEvent, interval, Observable, race, Subscription} from 'rxjs';
import {mapTo, switchMap, takeUntil, tap, throttleTime} from 'rxjs/operators';
import {GameInstructionsDialogComponent} from './game-instructions-dialog/game-instructions-dialog.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild('tar', {static: true, read: ElementRef}) ele1: ElementRef;
  @ViewChild('tar2', {static: true, read: ElementRef}) ele2: ElementRef;

  height1 = 50;
  height2 = 50;

  mouseover$: Observable<any>;
  mouseover2$: Observable<any>;
  mouseout$: Observable<any>;
  mouseout2$: Observable<any>;
  subscription: Subscription;
  points = 0;
  points$: Observable<any>;
  private counter = 0;
  private event1: Observable<any>;
  private event2: Observable<any>;
  disableReset = true;
  private isHandset = false;
  private throttleSpeed = 20;

  constructor(public dialog: MatDialog, private snack: MatSnackBar, private mediaObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
    this.mediaObserver.observe([Breakpoints.Handset, Breakpoints.Tablet]).subscribe(result => {
      if (result.matches) {
        this.isHandset = true;
        this.throttleSpeed = 10;
        console.log(this.throttleSpeed + ': handSet: ' + this.isHandset);
      }
    });
    this.mediaObserver.observe(Breakpoints.Web).subscribe(result => {
      if (result.matches) {
        this.isHandset = false;
        this.throttleSpeed = 20;
        console.log(this.throttleSpeed + ': handSet: ' + this.isHandset);
      }
    });
    this.openDialog();
  }

  ngAfterViewInit(): void {
    fromEvent(this.ele1.nativeElement, 'press').subscribe(console.log);
    this.mouseout$ = race(fromEvent(this.ele1.nativeElement, 'mouseout'));
    this.mouseout2$ = race(fromEvent(this.ele2.nativeElement, 'mouseout'));
    this.mouseover$ = race(fromEvent(this.ele1.nativeElement, 'mouseover'), fromEvent(this.ele1.nativeElement, 'click'))
      .pipe(switchMap(() => interval(1).pipe(mapTo(1),
        takeUntil(this.mouseout$), throttleTime(this.throttleSpeed), tap(val => {
          this.height1 += val;
          this.checkHeightIncrease(1);
        }))));
    this.subscription = this.mouseover$.subscribe(console.log);
    this.mouseover2$ = race(fromEvent(this.ele2.nativeElement, 'mouseover'), fromEvent(this.ele2.nativeElement, 'click'))
      .pipe(switchMap(() => interval(1).pipe(mapTo(1),
        takeUntil(this.mouseout2$), throttleTime(this.throttleSpeed), tap(val => {
          this.height2 += val;
          this.checkHeightIncrease(2);
        }))));
    this.subscription.add(this.mouseover2$.subscribe(console.log));
    this.event1 = this.mouseout$.pipe(switchMap(() => interval(5).pipe(mapTo(1),
      takeUntil(this.mouseover$), throttleTime(this.throttleSpeed),
      tap(val => {
        this.height1 -= val;
        this.checkHeightDecrease(1);
      }))));
    this.subscription.add(this.event1.subscribe(console.log));
    this.event2 = this.mouseout2$.pipe(switchMap(() => interval(5).pipe(mapTo(1),
      takeUntil(this.mouseover2$), throttleTime(this.throttleSpeed),
      tap(val => {
        this.height2 -= val;
        this.checkHeightDecrease(2);
      }))));
    this.subscription.add(this.event2.subscribe(console.log));
    this.points$ = combineLatest(this.mouseout$, this.mouseout2$).pipe(mapTo(1), tap(val => this.points += val));
  }

  private checkHeightIncrease(val: number) {
    if (this.counter === 0) {
      this.subscription.add(this.points$.subscribe());
      this.counter++;
    }
    if (val === 1) {
      if (this.height1 > (this.isHandset ? 200 : 300)) {
        this.subscription.unsubscribe();
        this.disableReset = false;
        this.openSnackBar();
      }
    } else {
      if (this.height2 > (this.isHandset ? 200 : 300)) {
        this.subscription.unsubscribe();
        this.disableReset = false;
        this.openSnackBar();
      }
    }
  }

  private checkHeightDecrease(val: number) {
    if (val === 1) {
      if (this.height1 < 100) {
        this.subscription.unsubscribe();
        this.disableReset = false;
        this.openSnackBar();
      }
    } else {
      if (this.height2 < 100) {
        this.subscription.unsubscribe();
        this.disableReset = false;
        this.openSnackBar();
      }
    }
  }

  validate1() {
    if (this.height1 > (this.isHandset ? 200 : 300) || this.height1 < 100) {
      return 'red';
    } else {
      return 'green';
    }
  }

  validate2() {
    if (this.height2 > (this.isHandset ? 200 : 300) || this.height2 < 100) {
      return 'red';
    } else {
      return 'green';
    }
  }

  openDialog() {
    const webinstructions = 'You can see two blocks are displayed with initial VALUE 50 in red(indicating not in range), ' +
      'you can increase the value of blocks by mouseover on the block and decrease the value by mouseout of the block. ' +
      'Now balance the value of both blocks simultaneously in such a way that the value in both the blocks is in the ' +
      'range 100 > VALUE < 300, if the value in any of the blocks is not in the given range the game automatically quits, ' +
      'a point is rewarded for each cross balancing between the blocks only. Start the game by mouseover on any of the block. ' +
      'GOOD LUCK:)';
    const mobileinstructions = 'You can see two blocks are displayed with initial VALUE 50 in red(indicating not in range), ' +
      'you can increase the value of blocks by tapping on the block and decrease the value by tapping out of the block. ' +
      'Now balance the value of both blocks simultaneously in such a way that the value in both the blocks is in the ' +
      'range 100 > VALUE < 200, if the value in any of the blocks is not in the given range the game automatically quits, ' +
      'a point is rewarded for each cross balancing between the blocks only. Start the game by tapping on any of the block. ' +
      'GOOD LUCK:)';
    const dialogRef = this.dialog.open(GameInstructionsDialogComponent, {
      width: this.isHandset ? '500px' : '450px',
      height: this.isHandset ? '400' : '360px',
      data: {data: (this.isHandset ? mobileinstructions : webinstructions)}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openSnackBar() {
    this.snack.open('You Scored: ', this.points.toString() + ' points', {
      duration: 2000,
      verticalPosition: this.isHandset ? 'bottom' : 'top',
    });
  }

  reset() {
    if (this.snack._openedSnackBarRef) {
      this.snack._openedSnackBarRef.dismiss();
    }
    this.disableReset = true;
    this.subscription = this.mouseover$.subscribe();
    this.subscription.add(this.mouseout$.subscribe());
    this.subscription.add(this.mouseover2$.subscribe());
    this.subscription.add(this.mouseout2$.subscribe());
    this.subscription.add(this.event2.subscribe());
    this.subscription.add(this.event1.subscribe());
    this.subscription.add(this.points$.subscribe());
    this.height1 = 50;
    this.height2 = 50;
    this.points = 0;
  }
}
