#!/bin/bash

$(aws ecr get-login --no-include-email --region us-west-2)

docker pull 537194362290.dkr.ecr.us-west-2.amazonaws.com/admin-dashboard-backend:latest
docker tag 537194362290.dkr.ecr.us-west-2.amazonaws.com/admin-dashboard-backend:latest admin-dashboard-backend:latest

docker pull 537194362290.dkr.ecr.us-west-2.amazonaws.com/admin-dashboard-frontend:latest
docker tag 537194362290.dkr.ecr.us-west-2.amazonaws.com/admin-dashboard-frontend:latest admin-dashboard-frontend:latest

docker run -d -e ENV=$ENV -e POINT_RDS_PASSWORD=$POINT_RDS_PASSWORD admin-dashboard-backend:latest
docker run -d -p 5000:80 admin-dashboard-frontend:latest
