import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-calendar-cell',
  templateUrl: './calendar-cell.component.html',
  styleUrls: ['./calendar-cell.component.css']
})
export class CalendarCellComponent {
  // value displayed in the cell
  @Input()
  public key?: any;
}
