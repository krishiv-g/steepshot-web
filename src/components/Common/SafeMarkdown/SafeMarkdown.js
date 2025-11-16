import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DOMPurify from 'dompurify';

/**
 * SafeMarkdown - A secure markdown renderer component
 * Replaces the deprecated and vulnerable react-render-html package
 *
 * Features:
 * - Sanitizes HTML with DOMPurify
 * - Supports GitHub Flavored Markdown
 * - Prevents XSS attacks
 * - Custom link handling
 */

const SafeMarkdown = ({ content, allowHtml = false, className = '' }) => {
  if (!content) {
    return null;
  }

  // If HTML is allowed, sanitize it first
  const processedContent = allowHtml
    ? DOMPurify.sanitize(content, {
        ALLOWED_TAGS: ['a', 'b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre'],
        ALLOWED_ATTR: ['href', 'target', 'rel']
      })
    : content;

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom link component to ensure external links open in new tab
          a: ({ node, ...props }) => {
            const isExternal = props.href && (props.href.startsWith('http://') || props.href.startsWith('https://'));
            return (
              <a
                {...props}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
              />
            );
          },
          // Ensure images are properly handled
          img: ({ node, ...props }) => {
            return (
              <img
                {...props}
                alt={props.alt || ''}
                loading="lazy"
                onError={(e) => {
                  e.target.src = (process.env.PUBLIC_URL || '') + '/images/noimage.jpg';
                }}
              />
            );
          }
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default SafeMarkdown;
