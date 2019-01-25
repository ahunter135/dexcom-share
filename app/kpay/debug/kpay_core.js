/*
* K·Pay Integration Library - v1.2.11 - Copyright Kiezel 2018
* Last Modified: 2018-11-09
*
* BECAUSE THE LIBRARY IS LICENSED FREE OF CHARGE, THERE IS NO
* WARRANTY FOR THE LIBRARY, TO THE EXTENT PERMITTED BY APPLICABLE
* LAW. EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT
* HOLDERS AND/OR OTHER PARTIES PROVIDE THE LIBRARY "AS IS"
* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED,
* INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
* MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE ENTIRE
* RISK AS TO THE QUALITY AND PERFORMANCE OF THE LIBRARY IS WITH YOU.
* SHOULD THE LIBRARY PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL
* NECESSARY SERVICING, REPAIR OR CORRECTION.
*
* IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN
* WRITING WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MAY
* MODIFY AND/OR REDISTRIBUTE THE LIBRARY AS PERMITTED ABOVE, BE
* LIABLE TO YOU FOR DAMAGES, INCLUDING ANY GENERAL, SPECIAL,
* INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR
* INABILITY TO USE THE LIBRARY (INCLUDING BUT NOT LIMITED TO LOSS
* OF DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY
* YOU OR THIRD PARTIES OR A FAILURE OF THE LIBRARY TO OPERATE WITH
* ANY OTHER SOFTWARE), EVEN IF SUCH HOLDER OR OTHER PARTY HAS BEEN
* ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
*/ 

/*****************************************************************************************/
/*                 GENERATED CODE BELOW THIS LINE - DO NOT MODIFY!                       */
/*****************************************************************************************/

import * as fs from "fs";
import * as messaging from 'messaging';
import * as kcm from '../../../common/kpay/kpay_common.js';
import * as kcfg from '../kpay_config.js';
import * as kp from './kpay.js';
export var kp0 = null, n = !1, e = {
    i: !1,
    t: !1,
    s: !1
}, t = null, a = null, s = null, o = null, u = !1, f = function() {
    return !1;
}, h = function() {}, y = function() {}, g = function() {}, P = function() {}, p = function() {}, m = function() {
    return !1;
}, _ = function(n, e, t) {
    return !0;
};

var KPAY_APP_ID = 1980028458;
export function init() {
    console.log("KPay - _initialize()"), A() ? (console.log("KPay - Fresh install detected; generating new State..."), 
    kp0 = {
        sl: !1,
        it: new Date().getTime()
    }, P(!0), h(!0), console.log("KPay - Storing new State on fs"), kp11()) : (console.log("KPay - Loading existing State from fs"), 
    F(), console.log("KPay - Loaded State: " + JSON.stringify(kp0)), P(!1), h(!1)), 
    messaging.peerSocket.addEventListener("open", p), 0 === messaging.peerSocket.readyState && p();
}

export function useFileTransfer() {
    n = !0;
}

export function processMessageFromCompanion(n) {
    console.log("_onMessageFromCompanion()"), M(n) ? (console.log("KPay - Message from companion: " + JSON.stringify(n)), 
    T(n)) : n && "start" === n.purchase ? (console.log("KPay - 'StartPurchase' message from companion"), 
    startPurchase()) : n && "cancel" === n.purchase && (console.log("KPay - 'CancelPurchase' message from companion"), 
    cancelPurchase());
}

function K() {
    console.log("KPay - _cancelFailsafeStatusCheckTimer()"), null !== a && (clearTimeout(a), 
    a = null);
}

export function kp1(n) {
    console.log("KPay - s tartStatusChecksWithFailsafe(immediateCheck == " + n + ")"), 
    e.s = !1, kp2(n);
}

export function kp2(n) {
    console.log("KPay - s cheduleFailsafeStatusCheck(immediateCheck == " + n + ")"), 
    K(), e.s ? console.log("KPay - kp2() - checking finished") : (n && v(), null === a && (console.log("KPay - scheduling failsafe check for over 15 seconds..."), 
    a = setTimeout(function() {
        kp2(!0);
    }, 15e3)));
}

export function kp3() {
    console.log("KPay - e ndStatusReached()"), K(), e.s = !0;
}

function v() {
    console.log("KPay - _statusCheck()"), e.s = !1, s || (s = Math.round(4294967295 * Math.random()));
    var n = w(KPAY_APP_ID, s, k(kcfg.KPAY_TEST_MODE, !u));
    console.log("KPay - Sending status request message to companion..."), b(n);
}

function k(t, a) {
    var s = 1;
    return t && (s |= 2), (a || e.t) && (s |= 4), s |= 32, n && (s |= 64), s;
}

function b(n) {
    console.log("KPay - _sendMessageToCompanion()");
    try {
        if (0 === messaging.peerSocket.readyState) return messaging.peerSocket.send(n), 
        void console.log("KPay - message sent succesfull!");
    } catch (n) {
        console.error(JSON.stringify(n));
    }
    S(n);
}

function S(n) {
    console.log("KPay - _outboxFailedHandler(): message sending failed!"), console.log("KPay - try again in a little while..."), 
    kp1(!1);
}

export function startPurchase() {
    console.log("KPay - s tartPurchase()"), kp0.sl || (kp0.te = !0, e.t = !0, e.s = !1, 
    kp11(), kp1(!0));
}

export function cancelPurchase() {
    console.log("KPay - c ancelPurchase()");
    var n = C();
    console.log("KPay - sending cancelPurchase message..."), b(n), kp0.sl || (kp0.te = !1, 
    e.t = !1, kp11(), kp3(), g(), t = null);
}

function w(n, e, t) {
    return {
        isKpayMsg: !0,
        type: 0,
        appId: n,
        random: e,
        flags: t
    };
}

function C() {
    return {
        isKpayMsg: !0,
        type: 3
    };
}

function M(n) {
    return kcm.isKPayMessage(n) && 1 === n.type;
}

export function getStatus() {
    return kp0.sl ? "licensed" : kp0.ts && !kp0.te ? "trial" : "unlicensed";
}

function T(n) {
    if (console.log("KPay - _handleStatusResult"), !_(n, s, k(kcfg.KPAY_TEST_MODE, !u))) return console.log("KPay - Invalid message received!"), 
    void kp1(!0);
    var a = n.serverResponse;
    if (console.log("KPay - Server response received: " + JSON.stringify(a)), "licensed" == a.status) kp0.sl = !0, 
    kp11(), kp5(7, null, !1), e.i = !1, kp3(); else if ("unlicensed" == a.status) {
        kp0.sl = !1, kp11(), 7 === t && (t = null), e.i = !0;
        var f = Number(a.paymentCode), h = f != o;
        o = f, "waitForUser" == a.purchaseStatus ? kp5(5, f, h) : "inProgress" == a.purchaseStatus && kp5(6, f, h), 
        kp1(!0);
    } else m(a) || (console.log("KPay - Unsupported status: " + a.status), kp1(!0));
}

export function kp5(n, a, s) {
    if (console.log("KPay - f ireEvent()"), (t !== n || s) && (t = n, 7 !== n || e.i)) {
        console.log("KPay - firing event callback for event " + n);
        try {
            f(n, a) || y(n, a);
        } catch (n) {}
    }
}

export function kp6() {
    return t;
}

export function kp7() {
    t = null;
}

export function setEventHandler(n) {
    f = n;
}

export function kp8(n, e, t) {
    h = n, y = e, g = t;
}

export function kp9(n, e, t) {
    u = !0, P = n, p = e, m = t;
}

export function kp10(n) {
    _ = n;
}

function A() {
    try {
        var n = fs.statSync("kps");
        return !(n && n.size);
    } catch (n) {
        return !0;
    }
}

function F() {
    A() || (kp0 = fs.readFileSync("kps", "cbor"));
}

export function kp11() {
    console.log("KPay - s aveState()"), fs.writeFileSync("kps", kp0, "cbor");
}

