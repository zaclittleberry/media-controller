'use strict';

const express = require('express');
var util = require('util');
var eiscp = require('eiscp');
var exec = require('child_process').exec;

// eiscp.discover(function(devices){
//   console.log(devices);
// });



function pioneer(cmd) {
  var baseCmd = './onkyo-iscp 192.168.1.254 ';
  var fullCmd = baseCmd + cmd;
  exec(fullCmd, function(error, stdout, stderr) {
    // command output is in stdout
    console.log(error);
    console.log(stdout);
    console.log(stderr);
  });
}

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

let options = {
  verify_commands: false,
  model: "VSX-LX101(Ether)",
};
eiscp.connect(options);

// Prints debugging info to the terminal
eiscp.on("debug", util.log);
// Prints errors to the terminal
eiscp.on("error", util.log);


eiscp.on('connect', function () {
  console.log('you are now connected');
});

app.get('/receiver/commands', (req, res) => {
  eiscp.get_commands('main', function (err, cmds) {
    res.send(cmds);
  });
});

app.get('/receiver/discover', (req, res) => {
  let options = {
    address: "192.168.1.254"
  };
  eiscp.discover(options, function (devices) {
    console.log(devices);
  });
});

app.get('/receiver/system-power/:status', (req, res) => {
  pioneer("PWR " + req.params.status);
  res.send('OK');
});

app.get('/receiver/master-volume/up', (req, res) => {
  pioneer("MVL UP");
  res.send('OK');
});

app.get('/receiver/master-volume/down', (req, res) => {
  pioneer("MVL DOWN");
  res.send('OK');
});

app.get('/receiver/master-volume/:level', (req, res) => {
  pioneer("MVL " + req.params.level);
  res.send('OK');
});

app.get('/receiver/input/up', (req, res) => {
  pioneer("SLI UP");
  res.send('OK');
});

app.get('/receiver/raw/:cmd', (req, res) => {
  pioneer(req.params.cmd);
  res.send('OK');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
