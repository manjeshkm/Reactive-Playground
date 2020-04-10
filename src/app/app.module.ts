import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {GameInstructionsDialogComponent} from './game-instructions-dialog/game-instructions-dialog.component';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatDividerModule,
  MatIconModule,
  MatSnackBarModule,
  MatToolbarModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutModule} from '@angular/cdk/layout';

@NgModule({
  declarations: [
    AppComponent,
    GameInstructionsDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatSnackBarModule,
    LayoutModule
  ],
  entryComponents: [GameInstructionsDialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
