import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Holiday} from '../Holiday';

@Injectable({
  providedIn: 'root'
})
export class HolidaysApiService {

  // test holidays
  private testHolidays: Holiday[] = [
    {names: ['Test holiday'], day: 23, month: 4, year: undefined},
    {names: ['Test holiday'], day: 30, month: 3, year: undefined}
  ]

  constructor() {
  }

  getHolidays(): Observable<any> {
    return of(this.testHolidays)
  }
}
