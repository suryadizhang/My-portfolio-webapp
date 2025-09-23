'use client';

import dynamic from 'next/dynamic';

const ChatWidgetClient = dynamic(
  () => import('./ChatWidget.client'),
  { ssr: false, loading: () => null }
);

export default function ChatWidgetWrapper() {
  return <ChatWidgetClient />;
}