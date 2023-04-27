import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {CalendarComponent} from './calendar/calendar.component';
import {CalendarCellComponent} from './calendar-cell/calendar-cell.component';
import {YearInputFieldComponent} from './year-input-field/year-input-field.component';
import {FormsModule} from "@angular/forms";
import {MonthSelectorComboBoxComponent} from './month-selector-combo-box/month-selector-combo-box.component';
import {DayInputFieldComponent} from './day-input-field/day-input-field.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {ApiModule, Configuration} from "./generated-client";
import {environment} from "../environments/environment";

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    CalendarCellComponent,
    YearInputFieldComponent,
    MonthSelectorComboBoxComponent,
    DayInputFieldComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ApiModule.forRoot(() => {
      return new Configuration({
        basePath: environment.apiUrl
      })
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, 'https://jernejvivod.github.io/simple-calendar/assets/i18n/');
}
