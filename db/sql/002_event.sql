CREATE EVENT IF NOT EXISTS clear_session
    ON SCHEDULE
        EVERY 1 HOUR
    COMMENT 'clear sessions table'
    DO
        DELETE FROM session WHERE period_date < NOW();

CREATE EVENT IF NOT EXISTS clear_refresh_session
    ON SCHEDULE
        EVERY 1 HOUR
    COMMENT 'clear refresh sessions table'
    DO
        DELETE FROM refresh WHERE period_date < NOW();

CREATE EVENT IF NOT EXISTS clear_nora_session
    ON SCHEDULE
        EVERY 1 HOUR
    COMMENT 'clear nora question session'
    DO
        DELETE FROM nora_session WHERE period_date < NOW();
