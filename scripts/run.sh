#!/bin/bash

$(aws ecr get-login --no-include-email --region us-west-2)

docker pull 537194362290.dkr.ecr.us-west-2.amazonaws.com/admin-dashboard-backend:latest
docker tag 537194362290.dkr.ecr.us-west-2.amazonaws.com/admin-dashboard-backend:latest admin-dashboard-backend:latest

docker pull 537194362290.dkr.ecr.us-west-2.amazonaws.com/admin-dashboard-frontend:latest
docker tag 537194362290.dkr.ecr.us-west-2.amazonaws.com/admin-dashboard-frontend:latest admin-dashboard-frontend:latest

docker stop admin-dashboard-backend
docker rm admin-dashboard-backend
docker run -d --name admin-dashboard-backend -p 5000:5000 -e ENV=$ENV -e POINT_RDS_PASSWORD=$POINT_RDS_PASSWORD admin-dashboard-backend:latest

docker stop admin-dashboard-frontend
docker rm admin-dashboard-frontend
docker run -d --name admin-dashboard-frontend -p 3000:80 admin-dashboard-frontend:latest
