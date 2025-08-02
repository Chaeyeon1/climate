import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useMarkdownContent } from '@/hooks/useMarkdownContent';
import { useState } from 'react';
import { CardParams } from '@/types';

export const MarkdownContent = () => {
  const { data, isLoading } = useMarkdownContent();

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px' }}>
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => <h1 style={{ fontSize: '2rem' }} {...props} />,
          a: ({ href, ...props }) => <a href={href} target="_blank" rel="noopener noreferrer" {...props} />,
        }}
        remarkPlugins={[remarkGfm]}
      >
        {data?.content}
      </ReactMarkdown>
    </div>
  );
};
