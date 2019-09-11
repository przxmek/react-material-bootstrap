#!/bin/bash

if [[ $# -eq 0 ]] ; then
    echo "ERROR: specify environment. Can be either 'prod' or 'dev'"
    exit 1
fi

if [ "$1" == "prod" ]
then
    echo "Deploying to prod environment..."
    npm run build-prod
elif [ "$1" == "dev" ]
then
    echo "Deploying to dev environment..."
    npm run build-dev
else
    echo "ERROR: invalid environment name"
    exit 1
fi