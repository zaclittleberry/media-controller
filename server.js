'use strict';

const express = require('express');
const exec = require('child_process').exec;

function pioneer(cmd) {
  let baseCmd = './onkyo-iscp 192.168.1.254 ';
  let fullCmd = baseCmd + cmd;
  exec(fullCmd, function(error, stdout, stderr) {
    // command output is in stdout
    console.log(stdout);
  });
}

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

/*
 * PWR - System Power Command
 */

app.get('/receiver/system-power/standby', (req, res) => {
  pioneer("PWR 00");
  res.send('OK');
});

app.get('/receiver/system-power/on', (req, res) => {
  pioneer("PWR 01");
  res.send('OK');
});

app.get('/receiver/system-power/status', (req, res) => {
  pioneer("PWR QSTN");
  res.send('Not Implemented');
});

/*
 * AMT - Audio Muting Command
 */

 app.get('/receiver/audio-muting/off', (req, res) => {
   pioneer("AMT 00");
   res.send('OK');
 });

 app.get('/receiver/audio-muting/on', (req, res) => {
   pioneer("AMT 01");
   res.send('OK');
 });

 app.get('/receiver/audio-muting/toggle', (req, res) => {
   pioneer("AMT TG");
   res.send('OK');
 });

 app.get('/receiver/audio-muting/status', (req, res) => {
   pioneer("AMT QSTN");
   res.send('Not Implemented');
 });

 /*
  * MVL - Master Volume Command
  */

app.get('/receiver/master-volume/up', (req, res) => {
  pioneer("MVL UP");
  res.send('OK');
});

app.get('/receiver/master-volume/down', (req, res) => {
  pioneer("MVL DOWN");
  res.send('OK');
});

app.get('/receiver/master-volume/up-more', (req, res) => {
  pioneer("MVL UP1");
  res.send('OK');
});

app.get('/receiver/master-volume/down-more', (req, res) => {
  pioneer("MVL DOWN1");
  res.send('OK');
});

app.get('/receiver/master-volume/status', (req, res) => {
  pioneer("MVL QSTN");
  res.send('OK');
});

app.get('/receiver/master-volume/:level', (req, res) => {
  // Valid inputs for :level are 0-100
  let int = parseInt(req.params.level);
  if (int < 0 || int > 200) {
    res.send('Error level out of range. Must be 1 - 200');
    return;
  }
  // :level converted to hex
  let level = int.toString(16);
  pioneer("MVL " + level);
  res.send('OK');
});

/*
 * SLI - Input Selector Command
 */

app.get('/receiver/input-selector/up', (req, res) => {
 pioneer("SLI UP");
 res.send('OK');
});

app.get('/receiver/input-selector/down', (req, res) => {
  pioneer("SLI DOWN");
  res.send('OK');
});

app.get('/receiver/input-selector/status', (req, res) => {
  pioneer("SLI QSTN");
  res.send('NOT IMPLEMENTED YET');
});

function validInputSelectors() {
  return {
    "01" : "CBL/SAT",
    "02" : "GAME",
    "03" : "AUX",
    "10" : "BD/DVD",
    "11" : "STRM BOX",
    "12" : "TV",
    "22" : "PHONO",
    "23" : "CD",
    "24" : "FM",
    "25" : "AM",
    "26" : "TUNER",
    "29" : "USB(Front)",
    "2B" : "NET",
    "2C" : "USB(toggle)",
    "2E" : "BT AUDIO",
    "55" : "HDMI 5",
    "56" : "HDMI 6",
  };
}

app.get('/receiver/input-selector/inputs', (req, res) => {
  let inputs = validInputSelectors();
  res.send(inputs);
});

app.get('/receiver/input-selector/:input', (req, res) => {
  let validInputs = validInputSelectors();
  let input = req.params.input;
  console.log("Requested Input:" + validInputs[input]);
  if (!validInputs.hasOwnProperty(input)) {
    res.send('Error input not valid. Must be a defined input.');
    return;
  }
  pioneer("SLI " + input);
  res.send('OK');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
