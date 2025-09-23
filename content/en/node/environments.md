---
title: Environments
type: docs
weight: 3
---

> You can set the settings below using environment variables or by placing them in a `.env` file.

| Variable                | Description                                                                                                      |
| :---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `SERVICE_PORT`          | Bind application to this port (default: `62050`).                                                                |
| `NODE_HOST`             | Bind application to this host (default: `127.0.0.1`).                                                            |
| `XRAY_EXECUTABLE_PATH`  | Path of Xray binary (default: `/usr/local/bin/xray`).                                                            |
| `XRAY_ASSETS_PATH`      | Path of Xray assets (default: `/usr/local/share/xray`).                                                          |
| `SSL_CERT_FILE`         | SSL certificate file to secure the application between master and node (better to use a real SSL with a domain). |
| `SSL_KEY_FILE`          | SSL key file to secure the application between master and node (better to use a real SSL with a domain).         |
| `API_KEY`               | Api Key to ensure only allowed clients can connect (type: `UUID`).                                               |
| `SERVICE_PROTOCOL`      | Protocol to use: `grpc` or `rest` (recommended: `grpc`).                                                         |
| `MAX_LOG_PER_REQUEST`   | Maximum number of logs per request (only for long polling in REST connections).                                  |
| `DEBUG`                 | Debug mode for development; prints core logs in the node server (default: `False`).                              |
| `GENERATED_CONFIG_PATH` | Path to the generated config by the node (default: `/var/lib/pasarguard/generated`).                             |
| `LogBufferSize`         | Buffer Size for logs to prevent channel deadlock (default: `1000`).                                              |
