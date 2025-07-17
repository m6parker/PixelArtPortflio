# Game Asset Library Makefile
# ---------------------------------
# Override at the CLI:
#   make run HOST_PORT=8080 DEV=false
#   make build NCACHE=--no-cache

# Image / container identifiers
IMAGE ?= game-asset-library
CONTAINER ?= game-asset-library

# Ports
# HOST_PORT → host side, APP_PORT → inside container
HOST_PORT ?= 3001
APP_PORT  ?= 3000

# Development / production switch
# DEV=true  → bind‑mount from current project directory (default)
# DEV=false → use volumes rooted under /var/www/$(IMAGE)
DEV ?= true

# Pick volume root according to DEV
ifeq ($(DEV),true)
VOL_ROOT := $(PWD)
else
VOL_ROOT := /var/www/$(IMAGE)
endif

UPLOADS_VOL = $(VOL_ROOT)/uploads:/app/uploads
DB_VOL      = $(VOL_ROOT)/files.db:/app/files.db

.PHONY: build run stop rm logs restart clean

## Build the Docker image
build:
	docker build $(NCACHE) -t $(IMAGE) .

## Run the container with correct volumes and port mapping
run:
	docker run -d \
	  --name $(CONTAINER) \
	  --restart unless-stopped \
	  -p 127.0.0.1:$(HOST_PORT):$(APP_PORT) \
	  -v $(UPLOADS_VOL) \
	  -v $(DB_VOL) \
	  $(IMAGE)

## Convenience targets
stop:
	docker stop $(CONTAINER) || true

rm:
	docker rm $(CONTAINER) || true

logs:
	docker logs -f $(CONTAINER)

restart: stop rm run

clean: stop rm
	docker image rm $(IMAGE) || true
