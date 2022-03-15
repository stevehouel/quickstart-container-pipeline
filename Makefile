SHELL:=/bin/bash

.DEFAULT_GOAL := install
.PHONY: bootstrap

export REGION ?= eu-west-1
export COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
export IMAGE_TAG=build-$(echo $CODEBUILD_BUILD_ID | awk -F":" '{print $2}')

docker-login:
	aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com

docker-build:
	docker build -t $IMAGE_REPO_URI:latest .
	docker tag $IMAGE_REPO_URI:latest $IMAGE_REPO_URI:$IMAGE_TAG

docker-push:
	docker push $IMAGE_REPO_URI:latest
	docker push $IMAGE_REPO_URI:$IMAGE_TAG

install:
	yarn install --frozen-lockfile
	yarn bootstrap

deploy-local:
	@yarn bootstrap
	@yarn build
	@cd packages/infra && \
	yarn cdk synth -a bin/local.js && \
	yarn cdk -a cdk.out/assembly-QuickstartContainerPipelineDev deploy \*

build:
	@yarn build

synth:
	@cd packages/infra && \
	yarn cdk synth -a bin/infra.js

deploy:
	@yarn bootstrap
	@yarn build
	@cd packages/infra && \
	yarn cdk deploy QuickstartContainerPipelineStack

pre-commit:
	@echo "Running pre-commit" checks
	@yarn lint
	@yarn build
	@yarn test
	@cd packages/infra && \
		yarn cdk synth -a bin/local.js && \
		yarn cdk -a cdk.out/assembly-QuickstartContainerPipelineDev deploy \*
