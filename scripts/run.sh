#!/bin/bash

if [ -z "$ENV" ]; then
    echo "ENV environment variable must be set! Allowed values: 'dev', 'prod'" && exit 1
fi

if [ -z "$POINT_RDS_PASSWORD" ]; then
    echo "POINT_RDS_PASSWORD environment variable must be set!" && exit 1
fi

if [ -z "$MJ_APIKEY_PUBLIC" ]; then
    echo "MJ_APIKEY_PUBLIC environment variable must be set!" && exit 1
fi

if [ -z "$MJ_APIKEY_PRIVATE" ]; then
    echo "MJ_APIKEY_PRIVATE environment variable must be set!" && exit 1
fi

$(aws ecr get-login --no-include-email --region us-west-2) || exit 1

if [ -z "$1" ]; then
    DOCKER_TAG="latest"
else
    DOCKER_TAG=$1
fi

echo "Using ${DOCKER_TAG} docker tag."

docker pull 537194362290.dkr.ecr.us-west-2.amazonaws.com/admin-dashboard-backend:${DOCKER_TAG}
docker tag 537194362290.dkr.ecr.us-west-2.amazonaws.com/admin-dashboard-backend:${DOCKER_TAG} admin-dashboard-backend:${DOCKER_TAG}

docker pull 537194362290.dkr.ecr.us-west-2.amazonaws.com/admin-dashboard-frontend:${DOCKER_TAG}
docker tag 537194362290.dkr.ecr.us-west-2.amazonaws.com/admin-dashboard-frontend:${DOCKER_TAG} admin-dashboard-frontend:${DOCKER_TAG}

echo "> Starting admin-dashboard-backend docker.."
docker rm -f admin-dashboard-backend || true
docker run -d --name admin-dashboard-backend -p 5000:5000 -e ENV=$ENV -e POINT_RDS_PASSWORD=$POINT_RDS_PASSWORD -e MJ_APIKEY_PUBLIC=$MJ_APIKEY_PUBLIC -e MJ_APIKEY_PRIVATE=$MJ_APIKEY_PRIVATE admin-dashboard-backend:${DOCKER_TAG}

echo "> Starting admin-dashboard-frontend docker.."
docker rm -f admin-dashboard-frontend || true
docker run -d --name admin-dashboard-frontend -p 3000:80 admin-dashboard-frontend:${DOCKER_TAG}

echo "> Ready!"

echo ""
echo "You can now view point-admin-dashboard in the browser."
echo ""
echo "    Local: http://localhost:3000/"
echo "    API:   http://localhost:5000/api"
echo ""
