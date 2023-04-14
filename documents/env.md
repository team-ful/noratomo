# 環境変数

```env
NODE_ENV=
PI_MODE=

# 全て
URL=
HOTPEPPER_API_KEY=
NEXT_PUBLIC_GOOGLE_MAP_KEY=
DISCORD_CONTACT_URL=

# piとproduction
CATEIRU_SSO_CLIENT_SECRET=
CATEIRU_SSO_CLIENT_ID=

# Productionのみ
DB_SOCKET_PATH=
DB_USER=
DB_PASSWORD=
INSTANCE_CONNECTION_NAME=
```

# PI_MODE

RaspberryPiで動かすときのモード。boolean

## URL

ローカルでカスタムURLを使用して検証できます。SSHなどでリモート接続している場合、そのIPアドレスを入力することでcookieやGASが使用できます。

指定しない場合、デフォルトは`localhost`です。

## HOTPEPPER_API_KEY

ホットペッパーAPIのKEYを入力します。入力しない場合、ホットペッパーAPIを使用する機能は使用できません。

[利用について](https://webservice.recruit.co.jp/doc/hotpepper/guideline.html)

## NEXT_PUBLIC_GOOGLE_MAP_KEY

Google MapsのAPI KEYを設定します。

[詳しくは公式ドキュメントを参照してください](https://developers.google.com/maps/documentation/android-sdk/get-api-key?hl=ja)

## DISCORD_CONTACT_URL

お問い合わせをDiscordのWebhookに送信するためのWebhook URL

## CATEIRU_SSO_CLIENT_SECRET

**piとproduction**のみ

CateiruSSOのClientSecret

## CATEIRU_SSO_CLIENT_ID

**piとproduction**のみ

CateiruSSOのClientID

## DB_SOCKET_PATH

**production**のみ

CloudSQLのSocket path

## DB_USER

**production**のみ

DBにアクセスできるユーザ

## DB_PASSWORD

**production**のみ

DBのパスワード

## INSTANCE_CONNECTION_NAME

**production**のみ

CloudRunでCloudSQLにアクセスする際に必要だった。
