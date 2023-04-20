package com.github.jernejvivod.simplecalendar.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.jernejvivod.simplecalendar.v1.model.HolidayDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.Dependent;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.InternalServerErrorException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

@Dependent
public class HolidaysService {
    private static final Logger logger = LoggerFactory.getLogger(HolidaysService.class);

    private static final ObjectMapper objectMapper = new ObjectMapper();

    // enum acting as a collection of singletons holding the lists of holidays for a given country in memory
    public enum Holidays {
        SI("/holidays/holidays_si.json");

        private final List<HolidayDto> holidayDtoList;

        public List<HolidayDto> getHolidayDtoList() {
            return holidayDtoList;
        }

        Holidays(String resourcesFilePath) {
            // parse list of holidays for path
            try (final InputStream inputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream(resourcesFilePath)) {
                logger.info("Reading holidays for path: {}", resourcesFilePath);
                this.holidayDtoList = objectMapper.readValue(
                        inputStream,
                        objectMapper.getTypeFactory().constructCollectionType(List.class, HolidayDto.class)
                );
            } catch (Exception e) {
                logger.error("Error reading holidays for path: {}", resourcesFilePath);
                throw new InternalServerErrorException("Error parsing holidays.", e);
            }
        }
    }

    // mapping of country codes (ISO 3166-1 alpha-2) to singleton holding the list of holidays
    private static final Map<String, Holidays> countryCodeToSingleton = Map.ofEntries(
            Map.entry("si", Holidays.SI)
    );

    /**
     * Get list of all holidays (repeating and non-repeating) for a country with the given country code (ISO 3166-1 alpha-2)
     */
    public List<HolidayDto> getAllHolidaysForCountryWithCountryCode(String countryCode) {
        if (!countryCodeToSingleton.containsKey(countryCode))
            throw new BadRequestException("Country code '%s' not supported.".formatted(countryCode));

        return countryCodeToSingleton.get(countryCode).getHolidayDtoList();
    }
}
