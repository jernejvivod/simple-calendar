package com.github.jernejvivod.simplecalendar.filter;

import org.jboss.resteasy.plugins.interceptors.CorsFilter;

import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.container.PreMatching;
import javax.ws.rs.ext.Provider;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Properties;

@Provider
@ApplicationScoped
@PreMatching
public class SimpleCalendarCorsFilter extends CorsFilter {
    public SimpleCalendarCorsFilter() throws IOException {
        Properties prop = new Properties();
        InputStream input = getClass().getClassLoader().getResourceAsStream("config.properties");
        prop.load(input);

        setAllowedMethods("GET,OPTIONS");
        getAllowedOrigins().addAll(Arrays.asList(prop.getProperty("allowedOrigins").split(",")));
    }
}
