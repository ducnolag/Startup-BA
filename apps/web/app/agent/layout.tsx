import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agent - Toolify.vn',
  description: 'Tư vấn mua sắm thông minh với AI Agent',
};

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
