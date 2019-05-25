Lambda@Edgeの挙動を確認する実験用プロジェクトです。

Lambda@EdgeのすべてのイベントにLambda関数を用意し、どのような条件で呼び出され、どのような引数が渡されるかを記録したものです。

# 利用技術

* Node.js
* Serverless
* Lambda@Edge

# セットアップとデプロイ

次のコマンドを実行すると新しいCloudFrontディストリビューションまでセットアップできます。デプロイには20分くらいかかります。

```bash
yarn install
yarn deploy
```

`run-all.sh`を実行すると、下記の実験リクエストを10秒間隔で実行します。

# Lambda@EdgeイベントとLambda関数に渡される値

作成されたCloudFrontディストリビューションに実際にリクエストを行った結果の出力とログを一例を紹介します。

* クエリ文字列の挙動も確認するため、すべてのリクエストには`?name1=value1&name2=value2`を付与しています。
* 各イベントではカスタムヘッダを追加しています。ヘッダ情報の伝播を確認するためです。
* イベントの値は`ClientIp`以外、実値です。CloudFrontのディストリビューションは削除済みなので応答しません。

## オリジンのindex.htmlを取得するケース

オリジンとした[Example Domain](http://example.com/)のルートドキュメント`index.html`へのリクエストです。

```bash
curl -X GET -I 'http://CloudFrontドメイン/index.html?name1=value1&name2=value2'
```

### index.htmlへの初回リクエスト

すべてのLambda@Edge関数が呼び出されます。

* [HTTPレスポンスヘッダ](doc/index-request/1st/http-response-header.txt)
* viewer-request [event](doc/index-request/1st/viewer-request.json)
* origin-request [event](doc/index-request/1st/origin-request.json)
* origin-response [event](doc/index-request/1st/origin-response.json)
* viewer-response [event](doc/index-request/1st/viewer-response.json)

### index.htmlへの2回目のリクエスト

CloudFrontがすでにキャッシュを保持しているので、オリジンへのリクエストが発生しません。そのため`origin-request`と`origin-response`は呼び出されません。

* [HTTPレスポンスヘッダ](doc/index-request/2nd/http-response-header.txt)
* viewer-request [event](doc/index-request/2nd/viewer-request.json)
* origin-request 呼び出されない
* origin-response 呼び出されない
* viewer-response [event](doc/index-request/2nd/viewer-response.json)

## viewer-requestでレスポンスを返すケース

URIパス`/dump-viewer-request-event`にリクエストすると、`viewer-request`の段階でレスポンス(イベント引数のダンプしたJSON)を返却します。

```bash
curl -X GET -I 'http://CloudFrontドメイン/dump-viewer-request-event?name1=value1&name2=value2'
```

### /dump-viewer-request-envetへの1回目のリクエスト

`viewer-request`でレスポンスを返却すると、それ以外のイベントは呼び出されません。

* [HTTPレスポンスヘッダ](doc/dump-viewer-request-event/1st/http-response-header.txt)
* viewer-request [event](doc/dump-viewer-request-event/1st/viewer-request.json)
* origin-request 呼び出されない
* origin-response 呼び出されない
* viewer-response 呼び出されない

### /dump-viewer-request-envetへの2回目のリクエスト

`viewer-request`で返却したレスポンスはキャッシュされることがないので、毎回動的な結果が出力されます。

* [HTTPレスポンスヘッダ](doc/dump-viewer-request-event/2nd/http-response-header.txt)
* viewer-request [event](doc/dump-viewer-request-event/2nd/viewer-request.json)
* origin-request 呼び出されない
* origin-response 呼び出されない
* viewer-response 呼び出されない

## origin-requestでレスポンスを返すケース

URIパス`/dump-origin-request-event`にリクエストすると、`origin-request`の段階でレスポンス(イベント引数のダンプしたJSON)を返却します。

```bash
curl -X GET -I 'http://CloudFrontドメイン/dump-origin-request-event?name1=value1&name2=value2'
```

### /dump-origin-request-envetへの1回目のリクエスト

`origin-response`は呼び出されませんが、`viewer-response`は呼び出されます。

* viewer-request [event](doc/dump-origin-request-event/1st/viewer-request.json)
* origin-request [event](doc/dump-origin-request-event/1st/origin-request.json)
* origin-response 呼び出されない
* viewer-response [event](doc/dump-origin-request-event/1st/viewer-response.json)

### /dump-origin-request-envetへの2回目のリクエスト

`origin-request`で返却したレスポンスはキャッシュされます。そのため`origin-request`と`origin-response`は呼び出されません。

* viewer-request [event](doc/dump-origin-request-event/2nd/viewer-request.json)
* origin-request 呼び出されない
* origin-response 呼び出されない
* viewer-response [event](doc/dump-origin-request-event/2nd/viewer-response.json)
