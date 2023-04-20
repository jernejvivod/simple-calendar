package com.github.jernejvivod.simplecalendar.v1.endpoint;

import com.github.jernejvivod.simplecalendar.service.HolidaysService;
import com.github.jernejvivod.simplecalendar.v1.api.HolidaysApi;

import javax.inject.Inject;
import javax.ws.rs.core.Response;

public class HolidaysEndpoint implements HolidaysApi {
    @Inject
    private HolidaysService holidaysService;

    @Override
    public Response allHolidays(String countryCode) {
        return Response.ok().entity(holidaysService.getAllHolidaysForCountryWithCountryCode(countryCode)).build();
    }
}
