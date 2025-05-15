// ==UserScript==
// @name         YouTube Ad Annihilator (Combined)
// @version      1.2.0
// @description  Skips/fast-forwards video ads & hides ad elements. Handles SPA.
// @author       Combined effort
// @match        *://*.youtube.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const log = (message) => { /* console.log(`[YT Ad Annihilator] ${message}`); */ };

  // --- CSS Injection from Script 2 ---
  const cssToInject = `
        #player-ads,
        .adDisplay,
        .ad-container,
        .ytd-display-ad-renderer,
        .video-ads,
        ytd-rich-item-renderer:has(ytd-ad-slot-renderer),
        ytd-ad-slot-renderer,
        #masthead-ad,
        *[class^="ytd-ad-"],
        #panels.ytd-watch-flexy,
        .ytp-ad-overlay-image, /* Added */
        .ytp-ad-text-overlay, /* Added */
        ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"], /* Added for new ad panel */
        .ytd-in-feed-ad-layout-renderer, /* Added for feed ads */
        ytd-promoted-sparkles-text-search-renderer, /* Added for search promoted */
        ytd-promoted-video-renderer /* Added for search promoted */
         {
            display: none !important;
        }
    `;
  const styleElement = document.createElement('style');
  styleElement.textContent = cssToInject;
  (document.head || document.documentElement).appendChild(styleElement);
  log("Injected CSS for hiding ad elements.");

  // --- JavaScript Logic from Script 1 (Refined) ---
  const attemptSkip = () => {
    let actionPerformed = false;

    const modernSkipButton = document.querySelector('.ytp-ad-skip-button-modern.ytp-button');
    if (modernSkipButton) {
      modernSkipButton.click();
      log('Clicked modern skip button');
      actionPerformed = true;
      return;
    }

    const classicSkipButton = document.querySelector('.videoAdUiSkipButton,.ytp-ad-skip-button');
    if (classicSkipButton) {
      classicSkipButton.click();
      log('Clicked classic skip button');
      actionPerformed = true;
      return;
    }

    const adShowingElements = document.querySelectorAll('.ad-showing, .video-ads .ad-container, .ytp-ad-player-overlay-layout');
    adShowingElements.forEach(adElement => {
      const videoPlayer = adElement.querySelector('video');
      if (videoPlayer && videoPlayer.duration > 0 && videoPlayer.currentTime < videoPlayer.duration) {
        if (!videoPlayer.muted) { // Mute if not already, sometimes helps
          // videoPlayer.muted = true; 
        }
        log(`Ad video detected, fast-forwarding: ${videoPlayer.src.substring(0, 50)}...`);
        videoPlayer.currentTime = videoPlayer.duration; // Jump to end
        actionPerformed = true;
      }
    });

    // if (actionPerformed) log("Attempted action.");
  };

  const runSkipper = () => {
    // log("Running attemptSkip due to event or initial load.");
    setTimeout(attemptSkip, 200);
    setTimeout(attemptSkip, 700);
    setTimeout(attemptSkip, 1500); // Additional attempts for resilience
  };

  if (document.readyState === "complete" || document.readyState === "interactive") {
    runSkipper();
  } else {
    document.addEventListener('DOMContentLoaded', runSkipper, { once: true });
  }

  document.addEventListener('yt-navigate-finish', runSkipper);
  document.addEventListener('yt-player-updated', runSkipper);
  document.addEventListener('spfdone', runSkipper);

  const observer = new MutationObserver((mutationsList, obs) => {
    for (const mutation of mutationsList) {
      if (mutation.addedNodes.length) {
        const hasRelevantNode = Array.from(mutation.addedNodes).some(node =>
          node.nodeType === 1 && (node.matches('.ytp-ad-skip-button-modern, .videoAdUiSkipButton, .ytp-ad-skip-button, .ad-showing, .video-ads, .ytp-ad-player-overlay-layout') || node.querySelector('.ytp-ad-skip-button-modern, .videoAdUiSkipButton, .ytp-ad-skip-button, .ad-showing, .video-ads, .ytp-ad-player-overlay-layout'))
        );
        if (hasRelevantNode) {
          // log("MutationObserver detected relevant node addition.");
          runSkipper();
          return;
        }
      }
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
  // log("Observer started on documentElement.");

})();
