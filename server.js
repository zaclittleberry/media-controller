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

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.set('json spaces', 2);

/*
 * PWR - System Power Command
 */

app.get('/receiver/system-power/standby', (req, res) => {
  pioneer("PWR 00");
  res.json({status:'OK'});;
});

app.get('/receiver/system-power/on', (req, res) => {
  pioneer("PWR 01");
  res.json({status:'OK'});;
});

app.get('/receiver/system-power/status', (req, res) => {
  pioneer("PWR QSTN");
  res.json({status:'Not Implemented'});
});

/*
 * AMT - Audio Muting Command
 */

 app.get('/receiver/audio-muting/off', (req, res) => {
   pioneer("AMT 00");
   res.json({status:'OK'});;
 });

 app.get('/receiver/audio-muting/on', (req, res) => {
   pioneer("AMT 01");
   res.json({status:'OK'});;
 });

 app.get('/receiver/audio-muting/toggle', (req, res) => {
   pioneer("AMT TG");
   res.json({status:'OK'});;
 });

 app.get('/receiver/audio-muting/status', (req, res) => {
   pioneer("AMT QSTN");
   res.json({status:'Not Implemented'});
 });

 /*
  * MVL - Master Volume Command
  */

app.get('/receiver/master-volume/up', (req, res) => {
  pioneer("MVL UP");
  res.json({status:'OK'});;
});

app.get('/receiver/master-volume/down', (req, res) => {
  pioneer("MVL DOWN");
  res.json({status:'OK'});;
});

app.get('/receiver/master-volume/up-more', (req, res) => {
  pioneer("MVL UP1");
  res.json({status:'OK'});;
});

app.get('/receiver/master-volume/down-more', (req, res) => {
  pioneer("MVL DOWN1");
  res.json({status:'OK'});;
});

app.get('/receiver/master-volume/status', (req, res) => {
  pioneer("MVL QSTN");
  res.json({status:'OK'});;
});

app.get('/receiver/master-volume/:level', (req, res) => {
  // Valid inputs for :level are 0-100
  let int = parseInt(req.params.level);
  if (int < 0 || int > 200) {
    res.json({status:'Error level out of range. Must be 1 - 200'});
    return;
  }
  // :level converted to hex
  let level = int.toString(16);
  pioneer("MVL " + level);
  res.json({status:'OK'});;
});

/*
 * SLI - Input Selector Command
 */

app.get('/receiver/input-selector/up', (req, res) => {
 pioneer("SLI UP");
 res.json({status:'OK'});;
});

app.get('/receiver/input-selector/down', (req, res) => {
  pioneer("SLI DOWN");
  res.json({status:'OK'});;
});

app.get('/receiver/input-selector/status', (req, res) => {
  pioneer("SLI QSTN");
  res.json({status:'Not Implemented'});
});

function validInputSelectors() {
  return [
    {
      name: "01",
      label: "CBL/SAT"
    },
    {
      name: "02",
      label: "GAME"
    },
    {
      name: "03",
      label: "AUX"
    },
    {
      name:"10",
      label: "BD/DVD"
    },
    {
      name:"11",
      label: "STRM BOX"
    },
    {
      name:"12",
      label: "TV"
    },
    {
      name:"22",
      label: "PHONO"
    },
    {
      name:"23",
      label: "CD"
    },
    {
      name:"24",
      label: "FM"
    },
    {
      name:"25",
      label: "AM"
    },
    {
      name:"26",
      label: "TUNER"
    },
    {
      name:"29",
      label: "USB(Front)"
    },
    {
      name:"2B",
      label: "NET"
    },
    {
      name:"2C",
      label: "USB(toggle)"
    },
    {
      name:"2E",
      label: "BT AUDIO"
    },
    {
      name:"55",
      label: "HDMI 5"
    },
    {
      name:"56",
      label: "HDMI 6"
    },
  ];
}

app.get('/receiver/input-selector/inputs', (req, res) => {
  let inputs = validInputSelectors();
  res.json(inputs);
});

app.get('/receiver/input-selector/:input', (req, res) => {
  let validInputs = validInputSelectors();
  let input = req.params.input;
  let valid = false;
  console.log("Requested Input:" + validInputs[input]);
  for (var i=0; i < validInputs.length; i++) {
    if (validInputs[i].name === input) {
        valid = true;
        break;
    }
  }
  if (!valid) {
    res.json({status:'Error input not valid. Must be a defined input.'});
    return;
  }
  pioneer("SLI " + input);
  res.json({status:'OK'});
});

/*
 * OSD - Setup Operation Command
 */

app.get('/receiver/setup-operation/up', (req, res) => {
  pioneer("OSD UP");
  res.json({status:'OK'});
});

app.get('/receiver/setup-operation/down', (req, res) => {
  pioneer("OSD DOWN");
  res.json({status:'OK'});
});

app.get('/receiver/setup-operation/right', (req, res) => {
  pioneer("OSD RIGHT");
  res.json({status:'OK'});
});

app.get('/receiver/setup-operation/left', (req, res) => {
  pioneer("OSD LEFT");
  res.json({status:'OK'});
});

app.get('/receiver/setup-operation/enter', (req, res) => {
  pioneer("OSD ENTER");
  res.json({status:'OK'});
});

app.get('/receiver/setup-operation/exit', (req, res) => {
  pioneer("OSD EXIT");
  res.json({status:'OK'});
});

app.get('/receiver/setup-operation/home', (req, res) => {
  pioneer("OSD HOME");
  res.json({status:'OK'});
});

app.get('/receiver/setup-operation/quick', (req, res) => {
  pioneer("OSD QUICK");
  res.json({status:'OK'});
});

/*
 * TUN - Tuning Command
 */

app.get('/receiver/tuning-command/up', (req, res) => {
  pioneer("TUN UP");
  res.json({status:'OK'});
});

app.get('/receiver/tuning-command/down', (req, res) => {
  pioneer("TUN DOWN");
  res.json({status:'OK'});
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
