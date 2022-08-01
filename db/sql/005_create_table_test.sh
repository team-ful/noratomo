

# testデータベースにnoratomoと同じテーブルを作成
mysql -uroot -proot test < "/docker-entrypoint-initdb.d/001_schema.sql"
mysql -uroot -proot test < "/docker-entrypoint-initdb.d/002_event.sql"
mysql -uroot -proot test < "/docker-entrypoint-initdb.d/003_create_index.sql"
