/**** BEGIN KPAY IMPORTS - REQUIRED ****/
/*
 * If you want (a lot of) logging from the K·pay library,
 * replace "release" with "debug" in the import path below
 */
import * as kpay from './kpay/release/kpay_companion.js';
import * as kpay_common from '../common/kpay/kpay_common.js';
/**** END KPAY IMPORTS ****/

import { outbox } from "file-transfer";
import { encode } from 'cbor';
import { settingsStorage } from "settings";

/**** KPAY INIT - REQUIRED ***/
kpay.initialize();


// A user changes settings
settingsStorage.onchange = evt => {
  restoreSettings();
};

function restoreSettings() {
    var username = getSettings('username').name;
    var password = getSettings('password').name;
    
    if (username === undefined || password === undefined) return;
  
  var data = {
    accountName: username,
    password: password,
    applicationId: "d89443d2-327c-4a6f-89e5-496bbb0317db"
  };
  console.log(JSON.stringify(data));
  fetch('https://share1.dexcom.com/ShareWebServices/Services/General/LoginPublisherAccountByName', {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    },
  }).then(function(response) {
    return response.json();
  }).then(function(data) {
    console.log(data);
    getUserData(data);
  });
}

function getUserData(sessionId) {
  fetch('https://share1.dexcom.com/ShareWebServices/Services/Publisher/ReadPublisherLatestGlucoseValues?sessionId=' + sessionId + '&minutes=1440&maxCount=1', {
    method: 'post',
    headers: {
      "Content-Type": "application/json"
    },
  }).then(function(response) {
    return response.json();
  }).then(function(data) {
    outbox.enqueue('shareData', encode(data));
  });
}


/* Helpers */
function getSettings(key) {
  if(settingsStorage.getItem( key )) {
    return JSON.parse(settingsStorage.getItem( key ));
  } else {
    return undefined
  }
}

restoreSettings();
setInterval(restoreSettings, 2 * 1000 * 60);
