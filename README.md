# booking-system

Clean the environment
```
docker stop $(docker ps -a -q)
docker rm $(docker ps -q -f "status=exited")
docker volume rm booking-system_app-volume
```
Build the project
```
docker-compose build
```
Run the project, i.e. run a local blockchain - with ganache-cli -, build the contract - using truffle - and start the app - made with react and next.
```
docker-compose up
```

Note that port 7545 is to be used by ganache, and then should not be used by another app.

