---
title: SSL
type: docs
weight: 6
language: zh
---

You can use SSL certificates issued by `Let's Encrypt` or other certificate authorities.  
Make sure to set both `SSL_CERT_FILE` and `SSL_KEY_FILE` environment variables.
Use `fullchain` for `SSL_CERT_FILE` and `cert` as `server_ca` in client side.

## self-signed certificate

If you don't have access to a real domain or tools like `ACME`, you can use `self-signed certificate` to connect to a node.  
Just replace the `CN` and `subjectAltName` values with your server information:

```shell
openssl req -x509 -newkey rsa:4096 -keyout /var/lib/pasarguard/certs/ssl_key.pem \
  -out /var/lib/pasarguard/certs/ssl_cert.pem -days 36500 -nodes \
  -subj "/CN={replace with your server IP or domain}" \
  -addext "subjectAltName = {replace with alternative names you need}"
```