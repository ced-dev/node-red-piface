module.exports = function (RED) {
    "use strict";
    var pfio = require("piface");
    var fs = require("fs");

    if (!fs.existsSync("/dev/ttyAMA0")) { // unlikely if not on a Pi
        throw "Info : Ignoring Raspberry Pi specific node.";
    }

    // Map names of pins to pin numbers
    var pintable = {
        "Button S1": 0,
        "Button S2": 1,
        "Button S3": 2,
        "Button S4": 3,
        "Input 5": 4,
        "Input 6": 5,
        "Input 7": 6,
        "Input 8": 7,
        "LED 0 / Relay 0": 0,
        "LED 1 / Relay 1": 1,
        "LED 2": 2,
        "LED 3": 3,
        "LED 4": 4,
        "LED 5": 5,
        "LED 6": 6,
        "LED 7": 7
    };

    function PiFACEIn(n) {
        RED.nodes.createNode(this, n);
        this.buttonState = -1;
        this.npin = n.pin;
        this.pin = pintable[n.pin];
        this.intype = n.intype;
        this.read = n.read || false;
        if (this.read) {
            this.buttonState = -2;
        }
        var node = this;
        if (node.pin !== undefined) {
            node._interval = setInterval(function () {
                var stdout = pfio.digital_read(node.pin);
                if (node.buttonState !== Number(stdout)) {
                    var previousState = node.buttonState;
                    node.buttonState = Number(stdout);
                    if (previousState !== -1) {
                        node.status({fill: "green", shape: "dot", text: node.buttonState.toString()});
                        var msg = {topic: "piface/" + node.npin, payload: node.buttonState};
                        node.send(msg);
                    }
                }
            }, 100);
        } else {
            node.error("Invalid PiFACE pin: " + n.pin);
        }
        node.on("close", function () {
            clearInterval(node._interval);
        });
    }

    function PiFACEOut(n) {
        RED.nodes.createNode(this, n);
        this.pin = pintable[n.pin];
        this.set = n.set;
        this.level = n.level;
        var node = this;
        if (node.pin !== undefined) {
            if (node.set) {
                pfio.digital_write(node.pin, node.level);
                node.status({fill: "yellow", shape: "dot", text: node.level});
            }
            node.on("input", function (msg) {
                if (msg.payload === "true") {
                    msg.payload = true;
                }
                if (msg.payload === "false") {
                    msg.payload = false;
                }
                var out = Number(msg.payload);
                if ((out === 0) | (out === 1)) {
                    pfio.digital_write(node.pin, out);
                    node.status({fill: "green", shape: "dot", text: out.toString()});
                } else {
                    node.warn("Invalid input - not 0 or 1");
                }
            });
        } else {
            node.error("Invalid PiFACE pin: " + n.pin);
        }
    }

    pfio.init();

    RED.nodes.registerType("piface in", PiFACEIn);
    RED.nodes.registerType("piface out", PiFACEOut);
};
