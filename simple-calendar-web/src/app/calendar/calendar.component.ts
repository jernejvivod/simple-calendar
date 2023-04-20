import {Component, OnInit} from '@angular/core';
import {Constants} from "../constants";
import {CalendarControlService} from "../services/calendar-control.service";

import {getDay, getDaysInMonth, startOfMonth} from 'date-fns'
import {HolidaysControlService} from "../services/holidays-control.service";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  public readonly namesOfDaysOfWeek = Constants.DAYS_OF_WEEK;

  // indices of days of selected month
  public daysOfMonth: number[] = []

  // indices of days of previous and next month displayed in grid for selected month
  public buffDaysOfPreviousMonth: number[] = []
  public buffDaysOfNextMonth: number[] = [];

  // set of date keys for efficient querying of holidays of the form 'MONTH-YEAR' (repeating holidays) or 'DAY-MONTH-YEAR' (for non-repeating holidays)
  private holidayDateKeysSet?: Set<string>;
  public selectedDate?: Date;

  constructor(private calendarControlService: CalendarControlService, private holidaysService: HolidaysControlService) {
  }

  ngOnInit(): void {
    this.calendarControlService.selectedDateObservable.subscribe(date => {
      // set new selected date and recompute indices for grid
      this.computeCalendarDayIndicesForDate(date);
      this.selectedDate = date;

      // set state (date) for HolidaysService
      this.holidaysService.changeDate(date);
    })

    // obtain set of holiday date keys for holidays for efficient querying
    this.holidaysService.holidayDateKeysSetObservable.subscribe(holidays => {
      this.holidayDateKeysSet = holidays;
    })
  }

  /**
   * Check if the given day of the selected month (with an offset) is a holiday.
   *
   * @param dayOfMonth day of month
   * @param monthModifier offset for the month of the currently selected date (e.g. if the selected month is 5 (June) and the value is -1, then May (4) will be used)
   */
  public isHoliday(dayOfMonth: number, monthModifier: number) {
    if (typeof this.holidayDateKeysSet === 'undefined') {
      return false
    }

    const year = this.selectedDate!.getFullYear()
    const month = (this.selectedDate!.getMonth() + monthModifier + 1) % 12 || 12;  // make sure that next month for December is January

    // query set of obtained date keys of holidays to determine if day is a holiday
    return this.holidayDateKeysSet.has(`${month}-${dayOfMonth}`) || this.holidayDateKeysSet.has(`${year}-${month}-${dayOfMonth}`);
  }

  public isSunday(dayOfMonth: number, monthModifier: number) {
    return new Date(this.selectedDate!.getFullYear(), this.selectedDate!.getMonth() + monthModifier, dayOfMonth).getDay() === 0
  }

  /**
   * Select day in current month.
   *
   * @param dayOfMonth day of current month to select
   */
  public selectInCurrentMonth(dayOfMonth: number) {
    this.calendarControlService.changeDay(dayOfMonth);
  }

  /**
   * Select day in next month.
   *
   * @param dayOfMonth day of next month to select
   */
  public selectInNextMonth(dayOfMonth: number) {
    this.calendarControlService.changeMonthToNextAndChangeDay(dayOfMonth);
  }

  /**
   * Select day in previous month.
   *
   * @param dayOfMonth day of previous month to select
   */
  public selectInPrevMonth(dayOfMonth: number) {
    this.calendarControlService.changeMonthToPrevAndChangeDay(dayOfMonth);
  }

  /**
   * Compute indices of days on calendar for selected date (days on the displayed grid).
   *
   * @param date selected date
   * @private
   */
  private computeCalendarDayIndicesForDate(date: Date) {
    this.expandOrContractIncrementingNumbersArrayToLimit(this.daysOfMonth, getDaysInMonth(date));

    // get day of week on which the month starts
    const dayStartOfMonth = getDay(startOfMonth(date));

    // compute number of 'buffer' days from the previous month to add before the days of the current month
    const sizeBuffDaysOfPreviousMonth = (dayStartOfMonth === 0 ? 7 : dayStartOfMonth) - 1;
    const daysInPrevMonth = getDaysInMonth(new Date(date.getFullYear(), date.getMonth() - 1));

    // recompute indices for 'buffer' days from the previous month
    this.buffDaysOfPreviousMonth = this.getArrayOfIncrementingIntegers(daysInPrevMonth - sizeBuffDaysOfPreviousMonth + 1, daysInPrevMonth);

    // recompute indices for 'buffer' days from the next month
    this.expandOrContractIncrementingNumbersArrayToLimit(this.buffDaysOfNextMonth, Constants.CALENDAR_GRID_SIZE - this.daysOfMonth.length - this.buffDaysOfPreviousMonth.length)
  }

  /**
   * Get array of incrementing integers from the argument for 'start' to the argument for 'lim' inclusive.
   *
   * @param start start integer
   * @param lim end integer
   * @private
   */
  private getArrayOfIncrementingIntegers(start: number, lim: number) {
    const res = [];
    for (let i = start; i <= lim; i++) {
      res.push(i);
    }
    return res;
  }

  /**
   * Expand or contract array of incrementing integers so that the last (highest) element is equal to argument for 'lim'.
   *
   * @param numArray array of incrementing integers
   * @param lim limit for the last (highest) element to which to expand or contract the argument array of incrementing integers
   * @private
   */
  private expandOrContractIncrementingNumbersArrayToLimit(numArray: number[], lim: number) {
    const topNumber = numArray.length === 0 ? 0 : numArray[numArray.length - 1]

    if (topNumber < lim) {
      for (let i = topNumber + 1; i <= lim; i++) {
        numArray.push(i);
      }
    } else if (topNumber > lim) {
      const nToRemove = topNumber - lim;
      numArray.splice(numArray.length - nToRemove, nToRemove);
    }
  }
}
