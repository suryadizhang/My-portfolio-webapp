'use client';

import { useEffect, useState } from 'react';

export default function ChatWidgetClient() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Create chat widget container
    const container = document.createElement('div');
    container.id = 'chat-widget-container';
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      font-family: system-ui, -apple-system, sans-serif;
    `;

    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.innerHTML = '💬';
    toggleButton.style.cssText = `
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #3b82f6;
      color: white;
      border: none;
      font-size: 24px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
    `;

    toggleButton.addEventListener('mouseenter', () => {
      toggleButton.style.transform = 'scale(1.05)';
      toggleButton.style.background = '#2563eb';
    });

    toggleButton.addEventListener('mouseleave', () => {
      toggleButton.style.transform = 'scale(1)';
      toggleButton.style.background = '#3b82f6';
    });

    // Create chat panel
    const chatPanel = document.createElement('div');
    chatPanel.style.cssText = `
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      border: 1px solid #e5e7eb;
      display: none;
      flex-direction: column;
      overflow: hidden;
    `;

    // Chat header
    const header = document.createElement('div');
    header.style.cssText = `
      background: #3b82f6;
      color: white;
      padding: 16px;
      font-weight: 600;
      border-radius: 12px 12px 0 0;
    `;
    header.textContent = 'Chat with me';

    // Chat body
    const body = document.createElement('div');
    body.style.cssText = `
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    `;

    // Welcome message
    const welcomeMsg = document.createElement('div');
    welcomeMsg.style.cssText = `
      background: #f3f4f6;
      padding: 12px;
      border-radius: 8px;
      color: #374151;
    `;
    welcomeMsg.textContent = "Hi! I'm Suryadi. Feel free to ask me anything about my work or experience.";

    body.appendChild(welcomeMsg);

    // Input area
    const inputArea = document.createElement('div');
    inputArea.style.cssText = `
      padding: 16px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 8px;
    `;

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Type your message...';
    input.style.cssText = `
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      outline: none;
    `;

    const sendBtn = document.createElement('button');
    sendBtn.textContent = 'Send';
    sendBtn.style.cssText = `
      padding: 8px 16px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    `;

    inputArea.appendChild(input);
    inputArea.appendChild(sendBtn);

    chatPanel.appendChild(header);
    chatPanel.appendChild(body);
    chatPanel.appendChild(inputArea);

    container.appendChild(toggleButton);
    container.appendChild(chatPanel);

    // Toggle functionality
    let isOpen = false;
    toggleButton.addEventListener('click', () => {
      isOpen = !isOpen;
      chatPanel.style.display = isOpen ? 'flex' : 'none';
      toggleButton.innerHTML = isOpen ? '✕' : '💬';
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target as Node) && isOpen) {
        isOpen = false;
        chatPanel.style.display = 'none';
        toggleButton.innerHTML = '💬';
      }
    });

    // Append to body
    document.body.appendChild(container);

    // Cleanup function
    return () => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  }, [isMounted]);

  // This component renders nothing to the React tree
  // All DOM manipulation happens in useEffect
  return null;
}