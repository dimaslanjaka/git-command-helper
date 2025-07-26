# syntax=docker/dockerfile:1.7-labs





FROM node:12 AS node12
WORKDIR /workspace
RUN apt-get update -y && apt-get install -y build-essential libssl-dev libcurl4-openssl-dev
COPY package.json ./
RUN npm install -g npm && npm install





FROM node:14 AS node14
WORKDIR /workspace
RUN apt-get update -y && apt-get install -y build-essential libssl-dev libcurl4-openssl-dev
COPY package.json ./
RUN npm install -g npm && npm install





FROM node:16 AS node16
WORKDIR /workspace
RUN apt-get update -y && apt-get install -y build-essential libssl-dev libcurl4-openssl-dev
COPY package.json ./
RUN npm install -g npm && npm install




FROM node:18 AS node18
WORKDIR /workspace
RUN apt-get update -y && apt-get install -y build-essential libssl-dev libcurl4-openssl-dev
COPY package.json ./
RUN curl -L -o .yarnrc.yml https://raw.githubusercontent.com/dimaslanjaka/nodejs-package-types/refs/heads/main/.yarnrc-template.yml
RUN corepack enable && corepack prepare yarn@stable --activate
RUN touch yarn.lock && yarn install




FROM node:20 AS node20
WORKDIR /workspace
RUN apt-get update -y && apt-get install -y build-essential libssl-dev libcurl4-openssl-dev
COPY package.json ./
RUN curl -L -o .yarnrc.yml https://raw.githubusercontent.com/dimaslanjaka/nodejs-package-types/refs/heads/main/.yarnrc-template.yml
RUN corepack enable && corepack prepare yarn@stable --activate
RUN touch yarn.lock && yarn install




FROM node:22 AS node22
WORKDIR /workspace
RUN apt-get update -y && apt-get install -y build-essential libssl-dev libcurl4-openssl-dev
COPY package.json ./
RUN curl -L -o .yarnrc.yml https://raw.githubusercontent.com/dimaslanjaka/nodejs-package-types/refs/heads/main/.yarnrc-template.yml
RUN corepack enable && corepack prepare yarn@stable --activate
RUN touch yarn.lock && yarn install
