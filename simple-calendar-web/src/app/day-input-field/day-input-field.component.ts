import {Component, OnInit} from '@angular/core';
import {CalendarControlService} from "../services/calendar-control.service";
import {getDaysInMonth} from 'date-fns'

@Component({
  selector: 'app-day-input-field',
  templateUrl: './day-input-field.component.html',
  styleUrls: ['./day-input-field.component.css']
})
export class DayInputFieldComponent implements OnInit {
  selectedDay?: number;
  isValidDay: boolean = true;
  maxDay: number | null = null;

  constructor(private calendarControlService: CalendarControlService) {
  }

  ngOnInit(): void {
    // listen for selected date changes and limit selection of days to last day of newly selected month
    this.calendarControlService.selectedDateObservable.subscribe(
      date => {
        this.selectedDay = date.getDate();
        this.maxDay = getDaysInMonth(date);
      }
    );
  }

  /**
   * Select new day using the input field (in currently selected month).
   */
  public onDaySelected() {
    if (this.selectedDay != null && this.isValidDay) {
      this.calendarControlService.changeDay(this.selectedDay);
    }
  }

  /**
   * Validate day selected using the input field (in currently selected month).
   * The day should be a valid day for the currently selected month.
   */
  validateDay(event: any) {
    const inputDay = event.target.value;
    this.isValidDay = inputDay >= 1 && inputDay <= this.maxDay!;
  }
}
