import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm';

export const InventoryDetail = () => {
  const { id } = useParams();
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    axios.get(`/inventory/${id}`).then((res) => {
      setMarkdown(res.data.content);
    });
  }, [id]);

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px' }}>
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => <h1 style={{ fontSize: '2rem' }} {...props} />,
          a: ({ href, ...props }) => <a href={href} target="_blank" rel="noopener noreferrer" {...props} />,
        }}
        remarkPlugins={[remarkGfm]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};
