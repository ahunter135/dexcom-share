/**** BEGIN KPAY IMPORTS - REQUIRED ****/
/*
 * If you want (a lot of) logging from the KPay library,
 * replace "release" with "debug" in the import paths for
 * ALL KPAY IMPORTS below
 *    ==> DO NOT MIX RELEASE AND DEBUG IMPORTS!
 */
// required imports
import * as kpay from './kpay/release/kpay.js';
import * as kpay_common from '../common/kpay/kpay_common.js';

/* Choose which type of "companion => phone communications" you want to use:
 *   - file transfer: is more reliable, uses more memory
 *          ==> import './kpay/release/kpay_filetransfer.js';
 *   - normal messaging: less reliable then file transfer, might cause frustration with the user if messaging fails, but uses less memory
 *          ==> import './kpay/release/kpay_messaging.js';
 * If you do not run into memory issues with your app or clockface, we recommend you use the file transfer communications
 */
import './kpay/release/kpay_filetransfer.js';
//import './kpay/release/kpay_messaging.js';

// optional imports, remove if not needed to save memory
import './kpay/release/kpay_dialogs.js';			// remove if you handle KPay dialogs yourself

// remove this is you want to choose yourself when the purchase starts,
// leave it in if you want the purchase to start automatically (either after a long trial or immediately at startup of the app)
// If you want the purchase to start immediately after install, just set the trial time to 0 in the product settings in your kpay account
import './kpay/release/kpay_time_trial.js';

/*
 * Removing the import below can save up to 8.5kb of extra memory.
 *
 * BEWARE: Only do this when you really need that extra memory and cannot get it by optimizing your own code!
 * Removing this import will disable the message checksum validation, which means the KPay lib
 * can no longer detect if the messages received from the KPay server are tampered with.
 * Eventhough the risk of your app being cracked are very small, removing this import makes it a possibility!
 */
import './kpay/release/kpay_msg_validation.js';			// remove if you need extra memory and are willing to take the risk described above
/**** END KPAY IMPORTS ****/

import clock from "clock";
import { battery } from "power";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { inbox } from "file-transfer";
import { readFileSync } from 'fs';
import { vibration } from "haptics";

/**** KPAY INIT - REQUIRED ***/
kpay.initialize();

// Get a handle on the elements
const background = document.getElementById("background");
const myLabel = document.getElementById("myLabel");
const batteryLabel = document.getElementById("batteryLabel");
const lastReading = document.getElementById("lastReading");
const dateLabel = document.getElementById("dateLabel")
const reading_arc = document.getElementById("reading-arc");
const battery_arc = document.getElementById("battery-arc");

//set default LR text
lastReading.text = "";

let lastReadValue = -1;

// Update the clock every minute
clock.granularity = "seconds";

background.onclick = (evt) => {
  console.log("HI");
 vibration.stop();
}

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  let ampm = "";
  if (hours < 12) ampm = "AM";
  else ampm = "PM";

  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  let secs = util.zeroPad(today.getSeconds());

  myLabel.text = `${hours}:${mins}:${secs} ${ampm}`;
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; 
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  dateLabel.text = mm + '/' + dd + '/' + yyyy;
  batteryLabel.text = Math.floor(battery.chargeLevel) + "%";
  battery_arc.sweepAngle = (battery.chargeLevel / 100) * 360;
  if (battery.chargeLevel <= 25) {
    battery_arc.style.fill = "red";
  } else {
    battery_arc.style.fill = "green";
  }
}

inbox.onnewfile = function () {
  do {
    let fileName = inbox.nextFile();
    if (fileName == "shareData") {
      var x = readFileSync('shareData', 'cbor');
      console.log(JSON.stringify(x));
      try {
        lastReadValue = x[0].Value;
      } catch (error) {
        lastReadValue = 0;
      }
      if (lastReadValue < 95) {
        vibration.start("alert");
      } else vibration.start("nudge");
      lastReading.text = lastReadValue;
    }
  } while (fileName);
};

background.onclick = function(e) {
  if ((lastReadValue <= 75 || lastReadValue > 150) && lastReadValue !== -1) {
    vibration.stop();
    myLabel.style.fill = "white";
    dateLabel.style.fill = "white";
    reading_arc.style.fill = "blue";
  }
}

