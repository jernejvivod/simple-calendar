import {Injectable} from '@angular/core';
import {Holiday} from '../Holiday';
import {BehaviorSubject} from 'rxjs';
import {HolidaysApiService} from './holidays-api.service';

@Injectable({
  providedIn: 'root'
})
export class HolidaysService {
  private dateKeyToHolidayNames?: Map<string, string[]>;
  private selectedHolidaysNames: string[] = [];

  // source of set of date keys for efficient querying of holidays of the form 'MONTH-YEAR' (repeating holidays) or 'DAY-MONTH-YEAR' (for non-repeating holidays)
  private holidayDateKeysSetSource = new BehaviorSubject<Set<string>>(new Set());
  public holidayDateKeysSetObservable = this.holidayDateKeysSetSource.asObservable();

  // source of names of holidays of the currently selected date
  private selectedHolidaysNamesSource = new BehaviorSubject<string[] | undefined>(this.selectedHolidaysNames);
  public selectedHolidaysNamesObservable = this.selectedHolidaysNamesSource.asObservable();

  constructor(private holidaysApiService: HolidaysApiService) {
    // request holidays from back-end
    holidaysApiService.getHolidays().subscribe(holidays => {

      // compute mapping of holiday date keys to array of holiday names
      this.dateKeyToHolidayNames = this.getDateKeyToHolidayNames(holidays);

      // compute set of holiday date keys
      this.holidayDateKeysSetSource.next(this.getHolidayDateKeySet(holidays));
    })
  }

  // change date (for querying and emitting holiday names)
  public changeDate(date: Date) {
    const year = date.getFullYear() ;
    const month = date.getMonth() + 1;
    const day = date.getDate();

    this.selectedHolidaysNamesSource.next(
      this.dateKeyToHolidayNames?.get(`${year}-${month}-${day}`) ?? this.dateKeyToHolidayNames?.get(`${month}-${day}`)
    );
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
      if (typeof holiday.year !== 'undefined') {
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
      if (typeof holiday.year !== 'undefined') {
        res.set(`${holiday.year}-${holiday.month}-${holiday.day}`, holiday.names);
      } else {
        res.set(`${holiday.month}-${holiday.day}`, holiday.names);
      }
    }
    return res;
  }
}
