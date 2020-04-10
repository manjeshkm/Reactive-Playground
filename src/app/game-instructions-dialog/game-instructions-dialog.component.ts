import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

interface DialogData {
  data: any;
}

@Component({
  selector: 'app-game-instructions-dialog',
  templateUrl: './game-instructions-dialog.component.html',
  styleUrls: ['./game-instructions-dialog.component.css']
})
export class GameInstructionsDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<GameInstructionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  Close() {
    this.dialogRef.close();
  }
}
