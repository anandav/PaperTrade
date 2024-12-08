docker build -t ptserver -f ./server/Dockerfile  .
docker build -t ptclient -f ./client/Dockerfile  .
docker run -dp :9090:9090 ptserver
docker run -dp :8080:8080 ptclient

docker pull mongodb/mongodb-community-server:latest
docker run -dp 27017:27017 mongodb/mongodb-community-server



