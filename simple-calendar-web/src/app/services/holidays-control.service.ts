import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, EMPTY, first, Subscription, takeWhile} from 'rxjs';
import {Holiday, HolidaysService} from "../generated-client";
import {Constants} from "../constants";

@Injectable({
  providedIn: 'root'
})
export class HolidaysControlService {
  private dateKeyToHolidayNames?: Map<string, string[]>;
  private holidaysInfo: string[] = [];
  private errorFetchingHolidays: boolean = false;

  // source of flag indicating if the holidays have been retrieved from the back-end
  private holidaysRetrievedSource = new BehaviorSubject<boolean>(false);

  // subscription for whether the holidays have been retrieved
  private holidaysInfoSubscription?: Subscription;

  // source of set of date keys for efficient querying of holidays of the form 'MONTH-YEAR' (repeating holidays) or 'DAY-MONTH-YEAR' (for non-repeating holidays)
  private holidayDateKeysSetSource = new BehaviorSubject<Set<string>>(new Set());
  public holidayDateKeysSetObservable = this.holidayDateKeysSetSource.asObservable();

  // source of names of holidays of the currently selected date
  private holidaysInfoSource = new BehaviorSubject<string[] | undefined>(this.holidaysInfo);
  public holidaysInfoObservable = this.holidaysInfoSource.asObservable();

  constructor(private holidaysService: HolidaysService) {

    // use default country code for holidays
    const defaultHolidaysCountryCode = Constants.DEFAULT_HOLIDAYS_COUNTRY_CODE;

    // request holidays from back-end
    holidaysService.allHolidays(defaultHolidaysCountryCode)
      .pipe(catchError(error => {
          this.errorFetchingHolidays = true;
          this.holidaysInfoSource.next(["apiError"])
          return EMPTY;
        })
      )
      .subscribe(holidays => {

        // compute mapping of holiday date keys to array of holiday names
        this.dateKeyToHolidayNames = this.getDateKeyToHolidayNames(holidays);

        // compute set of holiday date keys
        this.holidayDateKeysSetSource.next(this.getHolidayDateKeySet(holidays));

        // holidays have been retrieved
        this.holidaysRetrievedSource.next(true);
      })
  }

  // change date (for querying and emitting holiday names)
  public changeDate(date: Date) {
    if (this.errorFetchingHolidays)
      return;

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // set holiday info if holidays retrieved
    this.holidaysInfoSubscription?.unsubscribe();
    this.holidaysInfoSubscription = this.holidaysRetrievedSource.subscribe(retrieved => {
      if (retrieved) {
        this.holidaysInfoSource.next(
          this.dateKeyToHolidayNames?.get(`${year}-${month}-${day}`) ?? this.dateKeyToHolidayNames?.get(`${month}-${day}`)
        );
      }
    })
  }

  /**
   * Get set of date keys of the form 'MONTH-YEAR' (repeating holidays) or 'DAY-MONTH-YEAR' (for non-repeating holidays) for a list of holidays (for efficient querying)
   *
   * @param holidays array of holidays
   * @private
   */
  private getHolidayDateKeySet(holidays: Holiday[]): Set<string> {
    const res = new Set<string>();
    for (const holiday of holidays) {
      if (holiday.year != null) {
        res.add(`${holiday.year}-${holiday.month}-${holiday.day}`);
      } else {
        res.add(`${holiday.month}-${holiday.day}`);
      }
    }
    return res;
  }

  /**
   * Get mapping of date keys of the form 'MONTH-YEAR' (repeating holidays) or 'DAY-MONTH-YEAR' (for non-repeating holidays) to names of holidays
   *
   * @param holidays array of holidays
   * @private
   */
  private getDateKeyToHolidayNames(holidays: Holiday[]): Map<string, string[]> {
    const res = new Map<string, string[]>();
    for (const holiday of holidays) {
      if (holiday.year != null) {
        res.set(`${holiday.year}-${holiday.month}-${holiday.day}`, holiday.names);
      } else {
        res.set(`${holiday.month}-${holiday.day}`, holiday.names);
      }
    }
    return res;
  }
}
