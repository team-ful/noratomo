CREATE EVENT IF NOT EXISTS clear_session
    ON SCHEDULE
        EVERY 1 HOUR
    COMMENT 'clear sessions table'
    DO
        DELETE FROM session WHERE period_date < NOW();
