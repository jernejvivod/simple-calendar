import {Component, OnInit} from '@angular/core';
import {CalendarControlService} from "../services/calendar-control.service";
import {Constants} from "../constants";

@Component({
  selector: 'app-month-selector-combo-box',
  templateUrl: './month-selector-combo-box.component.html',
  styleUrls: ['./month-selector-combo-box.component.css']
})
export class MonthSelectorComboBoxComponent implements OnInit {
  public selectedMonth?: number;
  public months = Constants.MONTHS;

  constructor(private calendarControlService: CalendarControlService) {
  }

  ngOnInit(): void {
    this.calendarControlService.selectedDateObservable.subscribe(
      date => this.selectedMonth = date.getMonth()
    );
  }

  /**
   * Select new month using the combo-box.
   */
  public onMonthSelected() {
    this.calendarControlService.changeMonth(this.selectedMonth!);
  }
}
