# booking-system

## Clean the environment
### If you're running the app for the first time, go to the next command.
```
docker stop $(docker ps -a -q)
docker rm $(docker ps -q -f "status=exited")
docker volume rm booking-system_app-volume
```
## Build the project
```
docker-compose build
```
## Run the project
### That is: run a local blockchain - with ganache-cli -, build the contract - using truffle - and start the app - made with react and next.
```
docker-compose up
```

Note that port 7545 is to be used by ganache, and then should not be used by another app.
Once started, the app is available on localhost:3000.

# Important note
This repo contains two different projects: 
- a simple contract with only one ethereum account for Coca-Cola (branch `master`)
- a contract based on ERC721 for Pepsi (branch `pepsi`)

Each project can be built using docker commands given above.
