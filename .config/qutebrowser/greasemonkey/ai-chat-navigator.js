// ==UserScript==
// @name         AI Chat Scroller - Scroll to Previous/Next User Message
// @version      1.5
// @namespace    http://tampermonkey.net/  // Or your own unique namespace (e.g., your website, GitHub username)
// @description  Scrolls to the previous and next message sent by the user in Gemini, AI Studio, and ChatGPT. Fixes button disappearing on ChatGPT.
// @author       WideKnotLabs
// @match        https://gemini.google.com/*
// @match        https://aistudio.google.com/*
// @match        https://chatgpt.com/*
// @grant        GM_addStyle
// @license      MIT // Or another open-source license you prefer (e.g., GPL-3.0-or-later)
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VyclentQ29sb3IiPjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy00LjQxIDAtOC0zLjU5LTgtOHMzLjU5LTggOC04IDggMy41OSA4IDgtMy41OSA4LTggOHptLTEtMTFoMnYyaC0yem0wIDRoMnY2aC0yeiIvPjwvc3ZnPg== // Example icon (info icon) - optional
// @downloadURL https://update.greasyfork.org/scripts/537146/AI%20Chat%20Scroller%20-%20Scroll%20to%20Previous%20User%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/537146/AI%20Chat%20Scroller%20-%20Scroll%20to%20Previous%20User%20Message.meta.js
// ==/UserScript==


(function () {
  'use strict';

  // --- Configuration based on HTML analysis for ALL platforms ---

  // Selector for ALL message blocks (user and AI) on all platforms.
  // These should be the main containers for each distinct message entry.
  const allMessageBlocksSelector = [
    // Gemini selectors
    'span.user-query-bubble-with-background', // Gemini User
    'div.response-content',                   // Gemini AI

    // AI Studio selectors
    'div.user-prompt-container[data-turn-role="User"]', // AI Studio User
    'div.chat-turn-container.model',           // AI Studio AI (model turn)
    // 'div[data-turn-role="Model"]',          // Alternative for AI Studio AI if data-turn-role="Model" exists

    // ChatGPT selectors
    'div[data-message-author-role="user"]',    // ChatGPT User
    'div[data-message-author-role="assistant"]' // ChatGPT AI
  ].join(', '); // Joins into a single CSS selector string

  // Function to identify if a given message block is a USER message.
  function isUserMessage(messageElement) {
    // Check for Gemini user message pattern
    if (messageElement.matches('span.user-query-bubble-with-background')) {
      return true;
    }
    // Check for AI Studio user message pattern
    if (messageElement.matches('div.user-prompt-container[data-turn-role="User"]')) {
      return true;
    }
    // Check for ChatGPT user message pattern
    if (messageElement.matches('div[data-message-author-role="user"]')) {
      return true;
    }
    return false;
  }

  // --- End Configuration ---

  function highlightMessage(messageElement) {
    if (!messageElement) return;
    const originalOutline = messageElement.style.outline;
    const originalOffset = messageElement.style.outlineOffset;
    // Apply important to override existing styles if necessary
    messageElement.style.setProperty('outline', '3px dashed #007bff', 'important');
    messageElement.style.setProperty('outline-offset', '2px', 'important');

    setTimeout(() => {
      messageElement.style.outline = originalOutline;
      messageElement.style.outlineOffset = originalOffset;
    }, 2500);
  }

  function scrollToPreviousUserMessage() {
    const allMessages = Array.from(document.querySelectorAll(allMessageBlocksSelector));
    if (!allMessages.length) {
      console.warn("No message blocks found with combined selector:", allMessageBlocksSelector);
      alert("No message blocks found. The script's selectors might need an update if the site structure changed.");
      return;
    }

    const userMessages = allMessages.filter(isUserMessage);
    if (userMessages.length === 0) {
      alert("No user messages found on the page based on the current HTML selectors for any platform.");
      return;
    }

    let targetMessage = null;

    // Iterate backwards through user messages to find the navigation target
    for (let i = userMessages.length - 1; i >= 0; i--) {
      const msg = userMessages[i];
      const rect = msg.getBoundingClientRect();

      // Is this message (msg) the one currently "active" at the top of the viewport?
      // "Active" means its top is within a small threshold from the viewport top.
      if (rect.top >= -10 && rect.top < 50 && rect.bottom > 0) {
        if (i > 0) { // If this "active" message is not the first user message
          targetMessage = userMessages[i - 1]; // Target the one before it
        } else { // This is the first user message and it's "active"
          alert("You are at your first message.");
          highlightMessage(msg); // Re-highlight current if it's the first
          msg.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return; // Stop further processing
        }
        break; // Found our scenario, exit loop
      }

      // If not "active", is this message the first one whose bottom is above a certain point (e.g., 10px from top of viewport)?
      // This means it's the highest message that is (mostly) off-screen above or just at the top edge.
      if (rect.bottom < 10) {
        targetMessage = msg;
        break; // This is the highest user message that is primarily off-screen above
      }
    }

    // Fallback logic if no message was found by the loop above
    // (e.g., all user messages are fully in view, or view is below all user messages)
    if (!targetMessage && userMessages.length > 0) {
      let potentialTarget = null;
      // Try to find the last user message whose top is above the *center* of the viewport,
      // giving priority to messages further up if multiple qualify.
      for (let i = userMessages.length - 1; i >= 0; i--) {
        const msgRect = userMessages[i].getBoundingClientRect();
        // Is the message top above the vertical midpoint of the viewport?
        if (msgRect.top < window.innerHeight / 2) {
          potentialTarget = userMessages[i]; // This message is a candidate
          // If this candidate is also "active" at the top, we actually want the one *before* it.
          if (msgRect.top >= -10 && msgRect.top < 50 && msgRect.bottom > 0 && i > 0) {
            potentialTarget = userMessages[i - 1];
          }
          break; // Found the highest suitable candidate by this logic
        }
      }

      if (potentialTarget) {
        targetMessage = potentialTarget;
      } else {
        // If still no target (e.g., all user messages are below the viewport center, or only one message exists)
        // and the first user message isn't already "active", target the first user message.
        const firstMsg = userMessages[0];
        const firstMsgRect = firstMsg.getBoundingClientRect();
        if (!(firstMsgRect.top >= -10 && firstMsgRect.top < 50 && firstMsgRect.bottom > 0)) {
          targetMessage = firstMsg;
        } else if (userMessages.length === 1) { // Only one message, and it's active
          targetMessage = firstMsg; // Will trigger the "already at first message" alert or re-scroll
        }
      }
    }


    if (targetMessage) {
      const targetRect = targetMessage.getBoundingClientRect();
      const firstUserMessageRect = userMessages[0].getBoundingClientRect();

      // Check if the target is the first user message and if it's already effectively at the top
      if (targetMessage === userMessages[0] && targetRect.top >= -10 && targetRect.top < 50 && targetRect.bottom > 0) {
        alert("Already at the first user message.");
      }
      targetMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      highlightMessage(targetMessage);
    } else if (userMessages.length > 0) {
      // This is a safety net. If targetMessage is still null, but user messages exist,
      // it implies we are likely already at the first message.
      const firstMsg = userMessages[0];
      const firstMsgRect = firstMsg.getBoundingClientRect();
      if (firstMsgRect.top >= -10 && firstMsgRect.top < 50 && firstMsgRect.bottom > 0) {
        alert("Already at the first user message.");
        firstMsg.scrollIntoView({ behavior: 'smooth', block: 'start' }); // ensure it's perfectly at start
        highlightMessage(firstMsg);
      } else {
        // If something unexpected happened and no target was set, scroll to the first message.
        firstMsg.scrollIntoView({ behavior: 'smooth', block: 'start' });
        highlightMessage(firstMsg);
      }
    }
    // If userMessages.length === 0, it's caught at the beginning.
  }

  // NEW: Function to scroll to the NEXT user message
  function scrollToNextUserMessage() {
    const allMessages = Array.from(document.querySelectorAll(allMessageBlocksSelector));
    if (!allMessages.length) {
      console.warn("No message blocks found with combined selector:", allMessageBlocksSelector);
      alert("No message blocks found. The script's selectors might need an update if the site structure changed.");
      return;
    }

    const userMessages = allMessages.filter(isUserMessage);
    if (userMessages.length === 0) {
      alert("No user messages found on the page based on the current HTML selectors for any platform.");
      return;
    }

    let targetMessage = null;

    // Iterate forwards through user messages to find the navigation target
    for (let i = 0; i < userMessages.length; i++) {
      const msg = userMessages[i];
      const rect = msg.getBoundingClientRect();

      // Is this message (msg) the one currently "active" at the top of the viewport?
      if (rect.top >= -10 && rect.top < 50 && rect.bottom > 0) {
        if (i < userMessages.length - 1) { // If this "active" message is not the last user message
          targetMessage = userMessages[i + 1]; // Target the one after it
        } else { // This is the last user message and it's "active"
          alert("You are at your last message.");
          highlightMessage(msg); // Re-highlight current if it's the last
          msg.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return; // Stop further processing
        }
        break; // Found our scenario, exit loop
      }

      // If not "active", is this the first message whose top is below the viewport?
      // This means it's the next message that is off-screen below.
      if (rect.top > window.innerHeight) {
        targetMessage = msg;
        break;
      }
    }

    // Fallback logic if no message was found by the loop above
    // (e.g., scrolled to the very bottom, or all messages in view)
    if (!targetMessage && userMessages.length > 0) {
      let potentialTarget = null;
      // Try to find the first user message whose top is below the *center* of the viewport
      for (let i = 0; i < userMessages.length; i++) {
        const msgRect = userMessages[i].getBoundingClientRect();
        // Is the message top below the vertical midpoint of the viewport?
        if (msgRect.top > window.innerHeight / 2) {
          potentialTarget = userMessages[i]; // This message is a candidate
          // If this candidate is also "active" at the top, we want the one *after* it.
          if (msgRect.top >= -10 && msgRect.top < 50 && msgRect.bottom > 0 && i < userMessages.length - 1) {
            potentialTarget = userMessages[i + 1];
          }
          break; // Found the first suitable candidate
        }
      }
      if (potentialTarget) {
        targetMessage = potentialTarget;
      } else {
        // If still no target (e.g., all messages are above center), target the last message
        // unless it's already active.
        const lastMsg = userMessages[userMessages.length - 1];
        const lastMsgRect = lastMsg.getBoundingClientRect();
        if (!(lastMsgRect.top >= -10 && lastMsgRect.top < 50 && lastMsgRect.bottom > 0)) {
          targetMessage = lastMsg;
        } else if (userMessages.length === 1) {
          targetMessage = lastMsg;
        }
      }
    }


    if (targetMessage) {
      const targetRect = targetMessage.getBoundingClientRect();
      const lastUserMessage = userMessages[userMessages.length - 1];

      // Check if the target is the last user message and if it's already effectively at the top
      if (targetMessage === lastUserMessage && targetRect.top >= -10 && targetRect.top < 50 && targetRect.bottom > 0) {
        alert("Already at the last user message.");
      }
      targetMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      highlightMessage(targetMessage);
    } else if (userMessages.length > 0) {
      // Safety net for when we are already at the last message.
      const lastMsg = userMessages[userMessages.length - 1];
      const lastMsgRect = lastMsg.getBoundingClientRect();
      if (lastMsgRect.top >= -10 && lastMsgRect.top < 50 && lastMsgRect.bottom > 0) {
        alert("Already at the last user message.");
        lastMsg.scrollIntoView({ behavior: 'smooth', block: 'start' });
        highlightMessage(lastMsg);
      } else {
        lastMsg.scrollIntoView({ behavior: 'smooth', block: 'start' });
        highlightMessage(lastMsg);
      }
    }
  }


  // --- UI Initialization (Buttons, Styles, Shortcuts) ---
  function initializeUI() {
    // --- Button Styling and Creation ---
    GM_addStyle(`
.universalChatScrollBtn {
position: fixed !important;
right: 20px !important;
z-index: 2147483647 !important; /* Max z-index */
padding: 10px 15px !important;
background-color: #1a73e8 !important; /* Google Blue */
color: white !important;
border: none !important;
border-radius: 8px !important;
font-size: 14px !important;
font-weight: bold;
font-family: 'Google Sans', Roboto, Arial, sans-serif !important;
cursor: pointer !important;
box-shadow: 0 4px 10px rgba(0,0,0,0.25) !important;
transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out !important;
width: 150px; /* Set a fixed width */
text-align: center;
}
.universalChatScrollBtn:hover {
background-color: #1665c7 !important; /* Darker Google Blue */
}
.universalChatScrollBtn:active {
transform: scale(0.96) !important;
background-color: #1357a9 !important;
}
#universalChatScrollBtnPrev {
bottom: 65px !important;
}
#universalChatScrollBtnNext {
bottom: 20px !important;
}
`);

    // Previous Button
    const scrollButtonPrev = document.createElement('button');
    scrollButtonPrev.id = 'universalChatScrollBtnPrev';
    scrollButtonPrev.className = 'universalChatScrollBtn';
    scrollButtonPrev.textContent = '⬆️ Prev. User Msg';
    scrollButtonPrev.onclick = scrollToPreviousUserMessage;

    // Next Button
    const scrollButtonNext = document.createElement('button');
    scrollButtonNext.id = 'universalChatScrollBtnNext';
    scrollButtonNext.className = 'universalChatScrollBtn';
    scrollButtonNext.textContent = '⬇️ Next User Msg';
    scrollButtonNext.onclick = scrollToNextUserMessage;


    // Append buttons to the body
    document.body.appendChild(scrollButtonPrev);
    document.body.appendChild(scrollButtonNext);

    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
      // Previous: Ctrl+Shift+ArrowUp
      if (e.ctrlKey && e.shiftKey && e.key === 'ArrowUp') {
        e.preventDefault();
        scrollToPreviousUserMessage();
      }
      // Next: Ctrl+Shift+ArrowDown
      if (e.ctrlKey && e.shiftKey && e.key === 'ArrowDown') {
        e.preventDefault();
        scrollToNextUserMessage();
      }
    });

    console.log("Universal Chat Scroller Active (Gemini, AI Studio, ChatGPT). Buttons added. Shortcuts: Ctrl+Shift+ArrowUp/Down");
  }

  // --- Main Execution ---
  // Apply different initialization strategies based on the website.
  const currentHostname = window.location.hostname;

  if (currentHostname === 'chatgpt.com') {
    // For ChatGPT, wait 3 seconds to ensure the page is fully loaded and won't remove our buttons.
    console.log("ChatGPT detected. Delaying UI initialization by 3 seconds.");
    setTimeout(initializeUI, 3000);
  } else {
    // For AI Studio and Gemini, initialize immediately as they don't have this issue.
    // This uses the original script's robust loading logic.
    console.log("AI Studio or Gemini detected. Initializing UI immediately.");
    if (document.body) {
      initializeUI();
    } else {
      window.addEventListener('DOMContentLoaded', initializeUI);
    }
  }

})();
