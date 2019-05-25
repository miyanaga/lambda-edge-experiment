'use strict'

module.exports.viewerRequest = async (event) => {
  // リクエスト情報
  const cf = event.Records[0].cf

  // eventをログ出力
  process.stdout.write(`viewerRequest ${cf.request.uri} ${JSON.stringify(event)}`)

  // 独自ヘッダを設定
  cf.request.headers['x-at-viewer-request'] = [
    { key: 'x-at-viewer-request', value: new Date().toISOString() }
  ]

  // ここでレスポンスを返すパターン
  if (cf.request.uri == '/dump-viewer-request-event') {
    return {
      status: '200',
      headers: {
        'content-type': [ { key: 'Content-Type', value: 'application/json' } ]
      },
      body: JSON.stringify(event, null, 2),
    }
  }

  return cf.request
}

module.exports.originRequest = async (event) => {
  // リクエスト情報
  const cf = event.Records[0].cf

  // eventをログ出力
  process.stdout.write(`originRequest ${cf.request.uri} ${JSON.stringify(event)}`)

  // 独自ヘッダを設定
  cf.request.headers['x-at-origin-request'] = [
    { key: 'x-at-origin-request', value: new Date().toISOString() }
  ]

  // ここでレスポンスを返すパターン
  if (cf.request.uri == '/dump-origin-request-event') {
    return {
      status: '200',
      headers: {
        'content-type': [ { key: 'Content-Type', value: 'application/json' } ]
      },
      body: JSON.stringify(event, null, 2),
    }
  }

  return cf.request
}

module.exports.originResponse = async (event) => {
  const cf = event.Records[0].cf

  // eventをログ出力
  process.stdout.write(`originResponse ${cf.request ? cf.request.uri : ''} ${JSON.stringify(event)}`)

  // 独自ヘッダを設定
  cf.request.headers['x-at-origin-response'] = cf.response.headers['x-at-origin-response'] = [
    { key: 'x-at-origin-response', value: new Date().toISOString() }
  ]

  return cf.response
}

module.exports.viewerResponse = async (event) => {
  const cf = event.Records[0].cf

  // eventをログ出力
  process.stdout.write(`viewerResponse ${cf.request ? cf.request.uri : ''} ${JSON.stringify(event)}`)

  // 独自ヘッダを設定
  cf.request.headers['x-at-viewer-response'] = cf.response.headers['x-at-viewer-response'] = [
    { key: 'x-at-viewer-response', value: new Date().toISOString() }
  ]

  return cf.response
}
