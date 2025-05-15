// ==UserScript==
// @name        Fix web WhatsApp Notifications - Test (Button Element)
// @description	Hits the notification button, once
// @version		1.1
// @namespace   https://web.whatsapp.com/
// @match       https://web.whatsapp.com/*
// @run-at      document-idle
// @grant       none
// ==/UserScript==
(function () {
  'use strict';

  var checkCount = 0;
  var maxChecks = 60; // Try for 30 seconds (60 * 500ms)

  var waitForThatFrickingButton = setInterval(function () {
    checkCount++;
    // XPath 1: Targeting the <button> element
    let xpath = "/html/body/div[1]/div/div/div[3]/div/div[3]/div/span/div/div/div[2]/div[2]/div/span/button";
    let button = null;

    try {
      button = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    } catch (e) {
      console.error('[WhatsApp Fix] Error evaluating XPath:', xpath, e);
      clearInterval(waitForThatFrickingButton);
      return;
    }

    if (button) {
      console.log('[WhatsApp Fix] Button found with XPath (Attempt ' + checkCount + '): ' + xpath);
      button.click();
      console.log('[WhatsApp Fix] Button clicked.');
      clearInterval(waitForThatFrickingButton);
    } else {
      // console.log('[WhatsApp Fix] Button not found yet (Attempt ' + checkCount + ')... XPath: ' + xpath);
      if (checkCount >= maxChecks) {
        console.log('[WhatsApp Fix] Max attempts reached. Button not found with XPath: ' + xpath);
        clearInterval(waitForThatFrickingButton);
      }
    }
  }, 500); // Check every 500ms
})();
