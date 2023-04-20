import {Component, OnInit} from '@angular/core';
import {Constants} from '../constants';
import {CalendarControlService} from '../services/calendar-control.service';

@Component({
  selector: 'app-year-input-field',
  templateUrl: './year-input-field.component.html',
  styleUrls: ['./year-input-field.component.css']
})
export class YearInputFieldComponent implements OnInit {
  selectedYear?: number;
  isValidYear: boolean = true;

  constructor(private calendarControlService: CalendarControlService) {
  }

  ngOnInit(): void {
    this.calendarControlService.selectedDateObservable.subscribe(
      date => this.selectedYear = date.getFullYear()
    )
  }

  /**
   * Select new year using the input field.
   */
  public onYearSelected() {
    if (this.selectedYear != null && this.isValidYear) {
      this.calendarControlService.changeYear(this.selectedYear);
    }
  }

  /**
   * Validate year selected using the input field.
   * The year should be inside the defined interval.
   */
  validateYear(event: any) {
    const inputYear = event.target.value;
    this.isValidYear = inputYear >= Constants.MIN_YEAR && inputYear <= Constants.MAX_YEAR;
  }
}
