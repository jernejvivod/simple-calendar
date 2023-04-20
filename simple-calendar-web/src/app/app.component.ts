import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {HolidaysService} from "./services/holidays.service";
import {Constants} from "./constants";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // message containing information about the selected holidays
  public holidaysMessage?: string;

  constructor(public translateService: TranslateService, private holidaysService: HolidaysService) {
    // set default language
    translateService.setDefaultLang(Constants.DEFAULT_LANGUAGE);
  }

  ngOnInit(): void {
    // listen for names of selected holidays
    this.holidaysService.selectedHolidaysNamesObservable.subscribe(
      selectedHolidays => {
        this.holidaysMessage = selectedHolidays?.join(', ');  // set selected holidays as message
      }
    );
  }
}
