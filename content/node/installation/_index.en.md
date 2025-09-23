---
title: Installation
type: docs
weight: 2
language: en
---

# Installation

## One Click

run the following command in your shell and use node

```shell
sudo bash -c "$(curl -sL https://github.com/PasarGuard/scripts/raw/main/pg-node.sh)" @ install
```

## Docker

Install docker on your machine

```shell
curl -fsSL https://get.docker.com | sh
```

Download a docker compose file

```shell
wget https://raw.githubusercontent.com/PasarGuard/node/refs/heads/main/docker-compose.yml
```

Configure your .env file and run node with the following command

```shell
docker compose up -d
```

## Manual (Not For Beginners)

Install go on your system (https://go.dev/dl/)
Clone the project

```shell
git clone https://github.com/PasarGuard/node.git
```

Generate a binary file for your system

```shell
make deps
make
```

Install xray

```shell
make install_xray
```

Generate certificate based on your system network ip or domain

```shell
make generate_server_cert CN=example.com SAN="DNS:example.com,IP:your server ip"
```