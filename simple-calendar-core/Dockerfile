FROM quay.io/wildfly/wildfly:26.1.2.Final-jdk17

ARG WAR_PATH="deploy/*.war"
COPY $WAR_PATH /opt/jboss/wildfly/standalone/deployments

# Create a log directory to store log files and add the logger configuration
RUN mkdir /opt/jboss/wildfly/standalone/log
COPY deploy/logger.cli /opt/jboss/wildfly/
RUN /opt/jboss/wildfly/bin/jboss-cli.sh --file=/opt/jboss/wildfly/logger.cli


# Fix for Error: Could not rename /opt/jboss/wildfly/standalone/configuration/standalone_xml_history/current
USER root
RUN rm -rf /opt/jboss/wildfly/standalone/configuration/standalone_xml_history
RUN chown -R jboss:jboss /opt/jboss/wildfly/
USER jboss

EXPOSE 8080
