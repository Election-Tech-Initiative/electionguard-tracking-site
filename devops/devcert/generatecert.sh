#!/bin/bash

#openssl genrsa -des3 -passout pass:btdevcert -out localhost-bt-dev.pass.key 2048
#openssl rsa -passin pass:btdevcert -in localhost-bt-dev.pass.key -out localhost-bt-dev.key
#openssl req -new -key localhost-bt-dev.key -out localhost-bt-dev.csr
#openssl x509 -req -sha256 -days 365 -in localhost-bt-dev.csr -signkey localhost-bt-dev.key -out localhost-bt-dev.crt
openssl req -x509 -newkey rsa:4096 -sha256 -days 3650 -nodes -keyout localhost-bt-dev.key -out localhost-bt-dev.crt -subj //CN=localhost -addext subjectAltName=DNS:localhost,IP:127.0.0.1
openssl pkcs12 -export -out localhost-bt-dev.pfx -inkey localhost-bt-dev.key -in localhost-bt-dev.crt
