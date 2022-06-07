

# testデータベースにnoratomoと同じテーブルを作成
mysql -uroot -proot test < "/docker-entrypoint-initdb.d/001_schema.sql"
