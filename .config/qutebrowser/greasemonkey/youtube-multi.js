// ==UserScript==
// @name YouTube™ Multi Downloader v11.9 🌐 (Desktop & Mobile 🚀) — Shorts, Videos & Music | AdBlock 🚫🔥
// @name:pt-BR YouTube™ Multi Downloader v11.9 🌐 (PC & Celular 🚀) — Shorts, Vídeos & Música | AdBlock 🚫🔥
// @description Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience. 
// @description:pt-BR Adiciona um botão flutuante para baixar vídeos, Shorts e músicas do YouTube em alta qualidade, com bloqueio de anúncios integrado para uma experiência rápida e suave.
// @description:ar Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:bg Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:cs Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:da Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:de Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:el Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:eo Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:es Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:fi Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:fr Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:fr-CA Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:he Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:hu Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:id Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:it Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:ja Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:ko Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:nb Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:nl Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:pl Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:ro Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:ru Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:sk Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:sr Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:sv Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:th Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:tr Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:uk Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:ug Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:vi Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:zh-CN Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:zh-TW Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @namespace https://greasyfork.org/users/152924
// @homepageURL https://greasyfork.org/scripts/34613
// @supportURL https://greasyfork.org/scripts/34613/feedback
// @author Punisher
// @version 11.9 RTM
// @date 2026-02-27
// @icon https://iili.io/fOyuFFS.png
// @compatible chrome
// @compatible firefox
// @compatible opera
// @compatible safari
// @compatible edge
// @license CC-BY-NC-ND-4.0
// @match https://*.youtube.com/*
// @match https://music.youtube.com/*
// @grant GM_addStyle
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/34613/YouTube%E2%84%A2%20Multi%20Downloader%20v119%20%F0%9F%8C%90%20%28Desktop%20%20Mobile%20%F0%9F%9A%80%29%20%E2%80%94%20Shorts%2C%20Videos%20%20Music%20%7C%20AdBlock%20%F0%9F%9A%AB%F0%9F%94%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/34613/YouTube%E2%84%A2%20Multi%20Downloader%20v119%20%F0%9F%8C%90%20%28Desktop%20%20Mobile%20%F0%9F%9A%80%29%20%E2%80%94%20Shorts%2C%20Videos%20%20Music%20%7C%20AdBlock%20%F0%9F%9A%AB%F0%9F%94%A5.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let video;
  const floatBtnID = "ytPunisherBtn";
  const btnColor = "#575656";
  const MultiURL = [
    { name: "Download 1", baseURL: "//studiokitchen.ca/convert/?id=", useEncoder: false },
    { name: "Download 2", baseURL: "//ytmp4.biz/convert/?query=", useEncoder: true }
  ];

  const cssSelectorArr = [".video-ads.ytp-ad-module", "#player-ads .ytp-ad-module", ".ytp-ad-player-overlay", ".ytp-ad-preview-container", ".ytp-ad-progress-list", ".ytp-ad-skip-button", ".ytp-ad-skip-button-modern", ".ytp-ad-chrome-button", ".ytp-ad-persistent-progress-bar", ".yt-featured-product", ".ytp-suggested-action", ".ytp-ad-button", ".ytp-ad-overlay-container", ".ytp-ad-progress", ".ytp-ad-text", ".ytp-ad-overlay-slot", ".ytp-ad-top-slot", ".ytp-ad-bottom-slot", "ytd-reel-shelf-renderer ytd-ad-slot-renderer", "#shorts-player ytd-ad-slot-renderer", ".ytd-display-ad-renderer", ".ytd-display-ad-notice-renderer", ".ad-container", "ad-slot-renderer", "ytd-shorts-ad-renderer", "ytm-companion-ad-renderer", "ytd-endpoint-ad-renderer", "#related ytd-ad-slot-renderer", "#related #player-ads", "#related .#-ad-", "ytd-companion-ad-renderer", "ytd-watch-next-secondary-results-renderer ytd-ad-slot-renderer", ".ytd-rich-item-renderer.style-scope.ytd-rich-grid-row #content:has(.ytd-display-ad-renderer)", "#masthead-ad", "#player-ads", ".ytd-merch-shelf-renderer", "ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-ads']", "#panels > ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-ads']", "ytd-popup-container:has(a[href='/premium'])", "tp-yt-paper-dialog:has(yt-mealbar-promo-renderer)", "ytmusic-mealbar-promo-renderer", "ytmusic-statement-banner-renderer", ".ytd-promoted-video-renderer", ".ytd-promoted-sparkles-web-renderer", ".ytd-promoted-sparkles-text-search-renderer", ".ytd-sponsor-message-renderer", ".ytd-reel-shelf-renderer ytd-ad-slot-renderer:has(.yt-sparkle-overlay)", "ytd-reel-video-renderer ytd-ad-slot-renderer:has(.yt-sparkle-overlay)", "#secondary ytd-compact-promoted-video-renderer", "#secondary ytd-promoted-sparkles-web-renderer", "#secondary ytd-rich-item-renderer:has(.ytd-display-ad-renderer)", "ytm-companion-ad-renderer", ".ytd-endpoint-ad-renderer", "ytd-rich-section-renderer:has(ytd-display-ad-renderer)", ".ytd-video-masthead-ad", ".ytp-ad-image-overlay", ".ytp-ad-click-target", ".ytp-ad-annotation", ".ytp-ad-quiz-overlay", ".ytp-ad-companion-slot"];

  const checkRunFlag = id => {
    if (document.getElementById(id)) return true;
    const style = document.createElement("style");
    style.id = id;
    (document.head || document.body).appendChild(style);
    return false;
  };

  const generateRemoveADCssText = arr => arr.map(s => `${s}{display:none!important}`).join(" ");
  const getVideoID = url => {
    const m = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})|\/shorts\/([0-9A-Za-z_-]{11})/);
    return m ? (m[1] || m[2]) : null;
  };

  const getVideoDom = () => video = document.querySelector(".ad-showing video") || document.querySelector("video");
  const playAfterAd = () => { if (video && video.paused && video.currentTime < 1) video.play(); };

  const generateRemoveADHTMLElement = id => {
    if (checkRunFlag(id)) return;
    const style = document.createElement("style");
    style.appendChild(document.createTextNode(generateRemoveADCssText(cssSelectorArr)));
    (document.head || document.body).appendChild(style);
  };

  const closeOverlay = () => {
    document.querySelectorAll("ytd-popup-container a[href='/premium']").forEach(el => el.closest("ytd-popup-container")?.remove());
    document.querySelectorAll("tp-yt-iron-overlay-backdrop").forEach(el => { el.className = ""; el.removeAttribute("opened"); });
  };

  const nativeTouch = function () {
    const t = new Touch({ identifier: Date.now(), target: this, clientX: 0, clientY: 0, radiusX: 1, radiusY: 1, rotationAngle: 0, force: 1 });
    this.dispatchEvent(new TouchEvent("touchstart", { bubbles: true, cancelable: true, touches: [t], targetTouches: [t], changedTouches: [t] }));
    this.dispatchEvent(new TouchEvent("touchend", { bubbles: true, cancelable: true, touches: [], targetTouches: [], changedTouches: [t] }));
  };

  const skipAd = () => {
    if (!video) return;
    const btn = document.querySelector(".ytp-ad-skip-button, .ytp-skip-ad-button, .ytp-ad-skip-button-modern");
    const shortMsg = document.querySelector(".video-ads.ytp-ad-module .ytp-ad-player-overlay, .ytp-ad-button-icon");
    if ((btn || shortMsg) && location.hostname !== "m.youtube.com") video.muted = true;
    if (btn) { btn.click(); nativeTouch.call(btn); video.currentTime = video.duration; }
    else if (shortMsg) video.currentTime = video.duration;
  };

  const removePlayerAD = id => {
    if (checkRunFlag(id)) return;
    const obs = new MutationObserver(() => { getVideoDom(); closeOverlay(); skipAd(); playAfterAd(); });
    obs.observe(document.body, { childList: true, subtree: true });
  };

  function addFloatButton() {
    if (document.getElementById(floatBtnID)) return;
    const wrapper = document.createElement("div");
    wrapper.id = floatBtnID;
    const mainBtn = document.createElement("button");
    mainBtn.className = "punisher-main";
    const menu = document.createElement("div");
    menu.className = "punisher-menu";
    MultiURL.forEach(link => {
      const btn = document.createElement("button");
      btn.textContent = link.name;
      btn.onclick = () => {
        const vid = getVideoID(location.href);
        if (!vid) return;
        const finalParam = link.useEncoder ? encodeURIComponent(location.href) : vid;
        window.open(link.baseURL + finalParam, "_blank");
        menu.classList.remove("show");
      };
      menu.appendChild(btn);
    });

    wrapper.appendChild(mainBtn);
    wrapper.appendChild(menu);

    function updateMenuSide() {
      const rect = wrapper.getBoundingClientRect();
      const middle = window.innerWidth / 2;
      menu.classList.remove("left", "right");
      if (rect.left > middle) menu.classList.add("left");
      else menu.classList.add("right");
    }

    let dragging = false, ox = 0, oy = 0;
    const limit = (x, y) => ({
      x: Math.max(0, Math.min(x, innerWidth - wrapper.offsetWidth)),
      y: Math.max(0, Math.min(y, innerHeight - wrapper.offsetHeight))
    });

    const start = (x, y) => {
      dragging = true;
      const r = wrapper.getBoundingClientRect();
      ox = x - r.left;
      oy = y - r.top;
      wrapper.style.cursor = "grabbing";
    };

    const move = (x, y) => {
      if (!dragging) return;
      const p = limit(x - ox, y - oy);
      wrapper.style.left = p.x + "px";
      wrapper.style.top = p.y + "px";
      wrapper.style.right = wrapper.style.bottom = "auto";
      updateMenuSide();
    };

    const end = () => {
      dragging = false;
      wrapper.style.cursor = "grab";
    };

    mainBtn.onclick = e => {
      e.stopPropagation();
      updateMenuSide();
      menu.classList.toggle("show");
    };

    document.addEventListener("click", e => {
      if (!wrapper.contains(e.target)) menu.classList.remove("show");
    });

    wrapper.addEventListener("mousedown", e => start(e.clientX, e.clientY));
    document.addEventListener("mousemove", e => move(e.clientX, e.clientY));
    document.addEventListener("mouseup", end);
    wrapper.addEventListener("touchstart", e => start(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    document.addEventListener("touchmove", e => move(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    document.addEventListener("touchend", end);
    document.body.appendChild(wrapper);

    let hideTimer;
    function isFullscreen() {
      return document.fullscreenElement || document.webkitFullscreenElement;
    }

    function showButton() {
      wrapper.style.opacity = "1";
      clearTimeout(hideTimer);
      if (isFullscreen()) {
        hideTimer = setTimeout(() => {
          wrapper.style.opacity = "0";
        }, 3000);
      }
    }

    document.addEventListener("fullscreenchange", showButton);
    document.addEventListener("webkitfullscreenchange", showButton);
    document.addEventListener("mousemove", showButton);
    document.addEventListener("touchstart", showButton);
    showButton();
  }

  GM_addStyle(`#${floatBtnID}{position:fixed;top:70%;right:20px;transform:translateY(-50%);z-index:9999;transition:opacity .3s ease}
    .punisher-main{background:${btnColor} url("https://iili.io/fObpSDv.png") no-repeat center;background-size:65%;width:60px;height:60px;border-radius:50%;border:none;box-shadow:0 6px 12px rgba(0,0,0,.3);cursor:pointer}
    .punisher-menu{display:none;flex-direction:column;position:absolute;top:50%;transform:translateY(-50%);background:#1f1f1f;border-radius:8px;overflow:hidden;min-width:110px}
    .punisher-menu.show{display:flex}
    .punisher-menu.left{right:70px}
    .punisher-menu.right{left:70px}
    .punisher-menu button{background:#2c2c2c;border:none;color:#fff;padding:8px 12px;cursor:pointer}
    .punisher-menu button:hover{background:#3a3a3a}`
  );

  generateRemoveADHTMLElement("yt-remove-ad-css");
  removePlayerAD("yt-remove-player-ad");

  const update = () => { addFloatButton(); };
  let lastURL = location.href;
  setInterval(() => { if (location.href !== lastURL) { lastURL = location.href; update(); } }, 800);

  const domObserver = new MutationObserver(() => update());
  domObserver.observe(document.body, { childList: true, subtree: true });
  update();
})();
