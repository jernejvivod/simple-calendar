import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {getDaysInMonth} from "date-fns";

@Injectable({
  providedIn: 'root'
})
export class CalendarControlService {
  // currently selected date
  private selectedDate = new Date();

  // source of currently selected date
  private selectedDateSource = new BehaviorSubject<Date>(this.selectedDate);
  public selectedDateObservable = this.selectedDateSource.asObservable();

  /**
   * Change day of currently selected date.
   *
   * @param date new day of the month
   */
  public changeDay(date: number) {
    this.selectedDate.setDate(date)
    this.selectedDateSource.next(this.selectedDate);
  }

  /**
   * Change month of currently selected date. If the day of the month of the currently selected date is greater than the
   * number of days in the new month, set the day of the month to the last day of the new month.
   *
   * @param month new month
   */
  public changeMonth(month: number) {
    const daysInNewMonth = getDaysInMonth(new Date(this.selectedDate.getFullYear(), month))

    if (this.selectedDate.getDate() > daysInNewMonth) {
      this.selectedDate.setDate(daysInNewMonth);
    }
    this.selectedDate.setMonth(month);
    this.selectedDateSource.next(this.selectedDate);
  }

  /**
   * Change year of currently selected date. If the day of the month is greater than the
   * number of days in the same month of the new year (leap year), set the day of the month to the last day of the new month.
   *
   * @param year new year
   */
  public changeYear(year: number) {
    // handle leap year (29. February in leap year should become 28. February in non-leap year )
    const daysInMonthInNewYear = getDaysInMonth(new Date(year, this.selectedDate.getMonth()));

    if (this.selectedDate.getDate() > daysInMonthInNewYear)  // TODO test
    {
      this.selectedDate.setDate(daysInMonthInNewYear);
    }

    this.selectedDate.setFullYear(year);
    this.selectedDateSource.next(this.selectedDate);
  }

  /**
   * Change month to previous month and change day.
   *
   * @param date new day of the previous month
   */
  public changeMonthToPrevAndChangeDay(date: number) {
    this.selectedDate.setDate(1);
    this.selectedDate.setMonth(this.selectedDate.getMonth() - 1)
    this.selectedDate.setDate(date);
    this.selectedDateSource.next(this.selectedDate);
  }

  /**
   * Change month to next month and change day.
   *
   * @param date new day of the next month
   */
  public changeMonthToNextAndChangeDay(date: number) {
    this.selectedDate.setDate(1);
    this.selectedDate.setMonth(this.selectedDate.getMonth() + 1)
    this.selectedDate.setDate(date);
    this.selectedDateSource.next(this.selectedDate);
  }

}
