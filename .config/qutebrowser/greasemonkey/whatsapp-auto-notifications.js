// ==UserScript==
// @name        WhatsApp - Auto-click 'Turn on desktop notifications'
// @description Clicks the 'Turn on desktop notifications' banner button on WhatsApp Web.
// @version		1.3
// @namespace   https://web.whatsapp.com/
// @match       https://web.whatsapp.com/*
// @run-at      document-idle
// @grant       none
// ==/UserScript==
(function () {
  'use strict';

  var checkCount = 0;
  var maxChecks = 60; // Try for 30 seconds (60 * 500ms)
  var buttonClicked = false; // Flag to ensure we only click once

  var waitForThatButton = setInterval(function () {
    if (buttonClicked) { // If already clicked, stop checking
      clearInterval(waitForThatButton);
      return;
    }

    checkCount++;
    let button = null;

    // XPath: Find a div with role="button" that has a descendant span
    // containing the text "Turn on desktop notifications".
    // Using normalize-space() to handle potential extra whitespace.
    // Using contains() for partial text match flexibility, though full match is fine here.
    let xpath = "//div[@role='button' and .//span[contains(normalize-space(.), 'Turn on desktop notifications')]]";
    // Alternative, slightly more specific if the text is exact and only in one span:
    // let xpath = "//div[@role='button'][.//span[normalize-space(.)='Turn on desktop notifications']]";


    // You could also try targeting data-tab if the text changes or is unreliable, but text is usually better if stable.
    // let xpath = "//div[@role='button' and @data-tab='4' and .//span[contains(normalize-space(.), 'Turn on desktop notifications')]]";
    // Or even simpler if data-tab is unique enough for this button:
    // let xpath = "//div[@role='button' and @data-tab='4']";


    try {
      button = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    } catch (e) {
      console.error('[WhatsApp Fix] Error evaluating XPath:', xpath, e);
      clearInterval(waitForThatButton);
      return;
    }

    if (button) {
      console.log('[WhatsApp Fix] "Turn on notifications" button found (Attempt ' + checkCount + '): ' + xpath);
      button.click();
      console.log('[WhatsApp Fix] Button clicked.');
      buttonClicked = true; // Set the flag
      clearInterval(waitForThatButton);
    } else {
      // console.log('[WhatsApp Fix] "Turn on notifications" button not found yet (Attempt ' + checkCount + ')... XPath: ' + xpath);
      if (checkCount >= maxChecks) {
        console.log('[WhatsApp Fix] Max attempts reached. "Turn on notifications" button not found with XPath: ' + xpath);
        clearInterval(waitForThatButton);
      }
    }
  }, 500); // Check every 500ms
})();
