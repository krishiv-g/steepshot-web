import React from 'react';
import DOMPurify from 'dompurify';

/**
 * SafeHtml - A secure HTML renderer component
 * Replaces react-render-html with DOMPurify sanitization
 * Use this when you need to render pre-rendered HTML safely
 */

const SafeHtml = ({ html, className = '', allowedTags, allowedAttributes }) => {
  if (!html) {
    return null;
  }

  const config = {
    ALLOWED_TAGS: allowedTags || [
      'a', 'b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li',
      'blockquote', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'img', 'div', 'span'
    ],
    ALLOWED_ATTR: allowedAttributes || ['href', 'target', 'rel', 'src', 'alt', 'class', 'className'],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target', 'rel']
  };

  const sanitizedHtml = DOMPurify.sanitize(html, config);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

export default SafeHtml;
