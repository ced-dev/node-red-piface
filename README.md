node-red-piface
====================

<a href="http://nodered.org" target="_new">Node-RED</a> nodes to control a
<a href="http://www.piface.org.uk/products/piface_digital/" target="_new">PiFace Digital</a>
add-on board for a Raspberry-Pi.

**Note:** Some later versions of the PiFace relabelled the switch inputs to be `0 - 7`
instead of `1 - 8` as on the original boards.
We cannot automatically detect this so the user will have to apply some common sense.

Install
-------

Run the following command in your Node-RED user directory - typically `~/.node-red`

    npm install node-red-piface


Pre-reqs
--------

Device Tree **must** be turned off. To do this run

    sudo raspi-config

then select the `Advanced Options`, then `Device Tree`, and finally select `No`
and `OK`. You will then need to reboot.


Usage
-----

A pair of input and output Node-RED nodes for the Raspberry Pi PiFace Digital
add-on board.

### Output

The PiFace output node will set the selected relay, LED, or pin on or off
depending on the value passed in. Expects a `msg.payload` with either a
1 or 0 (or true or false).


### Input

The PiFace input node generates a `msg.payload` with either a 0 or 1
depending on the state of the input pin.

The `msg.topic` is set to <i>piface/{the pin number}</i>

<b>Note:</b> This node currently polls the pin every 100ms.
