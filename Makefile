include .env

build:
	IMAGEKIT_PRIVATE_KEY=$(IMAGEKIT_PRIVATE_KEY) IMAGEKIT_URL_ENDPOINT=$(IMAGEKIT_URL_ENDPOINT) python3 build.py

deploy: build
	rsync -rlDzv --no-owner --no-group --no-times --chmod=D775,F664 out/ $(DEPLOY_USER)@$(DEPLOY_HOST):$(DEPLOY_PATH)
