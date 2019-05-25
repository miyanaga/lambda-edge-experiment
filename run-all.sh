#!/bin/sh

if [ "$1" = "" ]; then
  echo "usage: $0 'CloudFront Domain Name(ex foobarfuga.cloudfront.net)'"
  exit 1
fi

CF=$1
QS="?name1=value1&name2=value2"
SLEEP=10

for URI in index.html dump-viewer-request-event dump-origin-request-event
do
  curl -X GET -I "https://$CF/$URI$QS"
  sleep $SLEEP
  curl -X GET -I "https://$CF/$URI$QS"
  sleep $SLEEP
done