BluePark: An Indoor Location-Based Parking System
===================

### DAVID BOONE, ANA-MARIA CONSTANTIN, SAMI GHOCHE and BENJY LEVIN

We introduce a novel solution for efficient indoor navigation in a parking lot. Our ap-
proach relied heavily on Bluetooth communication between cars and beacons placed strategically across the parking lot. This communication served primarily to estimate the positions of cars, which were used by a centralized controller in order to provide accurate and optimal navigation instructions to each car. In order to provide accurate loca-
tion estimations, we relied on a Bluetooth Received Signal Strength Indicator (RSSI) approach, coupled with a measure of a car’s current direction of movement. Our beacons were programmed to receive this information broadcasted by the cars driving through the parking lot and further send it to an Azure Web server that automatically com-
putes navigation directions towards the closest available parking spot, in a dynamic manner.

We are using Intel Edison boards as both beacons and car transmitters because they come equipped with BLE and Wi-Fi capabilities. We are installing the Bluez5 protocol stack on the Edison Yocto OS because it provides all the core Bluetooth modules that we require in order to send custom broad-
cast messages and read them once received.

All the code was written by us. We made extensive use of Node.js and the following two node libraries:

###### [Bleno.js](https://github.com/sandeepmistry/bleno):
- We use Bleno to send custom broadcasts identified by a unique Bluetooth "UUID" as well as a payload of up to 31 bytes.
- At the moment our payload consists only of the car’s direction, but in the future it could also be used for measurements such as speed. 

###### [Noble.js](https://github.com/sandeepmistry/noble):
- We use Noble to receive the broadcasts, identify the sender through its "UUID", and read the payload.

#### Overview of the files:
* `detect.js`:
This file is run on the beacons strategically placed in the parking lot.
It contains each beacon's unique ID, direction, and is listening for suitable vehicle's advertising packets.
Upon detecting k=10 packets from a specific car's UUID, it will forward this data to the server via a websocket.
This is simply run on the beacon by typing ```node detect.js```

* `car-broadcast.js`:
This file is responsible for the car advertising itself to the BluePark system, and is thus run on the vehicle.
It is set up such that it will advertise its name, and its direction info in its payload that is currently specified by
the user manually during run time via "UP", "DOWN", "LEFT", "RIGHT", arrows in the terminal.
This is simply run on the car by typing ```node car-broadcast.js```

* `server`:
This folder contains the files that are running on the Azure Cloud VM acting as our central controller server. The server was initially setup using `express-generator`, but then was modified and customized to its current state.

To run this server, cd into the home directory and type ```sudo npm start```. The `index.html` will be served to port 3000 on the running machine. The socket.io server will be set up on port 8080 on the running machine.

* `server/bin/www`
This is the node file that is the brains of the server. It handles all the incoming updates from the beacons and records the closest beacon based on RSSI and direction in the server's dictionary. It then sends updates to the webpage to display the appropriate route and information. 

* `server/public`
This folder contains all publicly available files on the webpage, such as html, images, css etc.
It contains `index.html` which is our GUI, and is used for the demo purpose of moving the graphic of the vehicle based on received closest beacon.

#### Useful Links: 

A video demo of our system can be found here: [BluePark Demo]()

A set of instrutions compiled by us, on how one can go about setting up an Intel Edison to use with BLE (BlueZ, Bleno, Noble) on the Harvard network can be found [here](https://docs.google.com/a/college.harvard.edu/document/d/1iR57Iap1c571q3fuHhdqiF4heln8tEoL8VupF8XeqZY/edit?usp=sharing)

#### License:

The MIT License (MIT)

Copyright (c) {{{2014}}} {{{DAVID BOONE, ANA-MARIA CONSTANTIN, SAMI GHOCHE and BENJY LEVIN}}}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.