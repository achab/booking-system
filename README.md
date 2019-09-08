# booking-system

`docker-compose up` to run ganache, build the contract and start the app

Note that port 7545 is to be used by ganache, and then should not be used by another app.

To build the image:
`docker build -t booking .`

To run the image, and port-forward on 3000 (app will listen to this port)
`docker run -p 3000 booking`

