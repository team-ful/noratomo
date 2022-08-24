--すでに作成されたentryと統計情報のentryの数をあわせるクエリ
INSERT INTO
    number_of (user_id, entry)
    SELECT
        user.id,
        (SELECT COUNT(*)
            FROM entry
            WHERE entry.owner_user_id = user.id
        )
        FROM user
    WHERE NOT EXISTS (
        SELECT *
            FROM number_of
            WHERE number_of.user_id = user.id
    );
