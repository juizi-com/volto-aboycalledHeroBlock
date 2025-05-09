import React from 'react';

const getHref = (link) => {
  const item = Array.isArray(link) ? link[0] : link;
  return item?.['@id'] || '#';
};

const View = (props) => {
  const { data, properties = {} } = props;

  const rawId = data?.backgroundVideo?.[0]?.['@id'] || '';
  const filename = rawId.split('/').filter(Boolean).pop();
  const isAlreadyDownloadUrl = rawId.includes('/@@download/');
  const videoUrl = rawId && filename
    ? (isAlreadyDownloadUrl ? rawId : `${rawId}/@@download/file/${filename}`)
    : null;

  const pageTitle = properties?.title || '';
  const pageDescription = properties?.description || '';
  const displayTitle = data.usePageTitle ? pageTitle : data.title;
  const displaySubtitle = data.usePageDescription ? pageDescription : data.subtitle;

  const image = data.backgroundImage?.[0];
  const baseUrl = properties?.['@id'] || '';
  const imageUrl = data.usePreviewImage
    ? `${baseUrl}/@@images/preview_image`
    : (image
        ? `${image['@id']}/@@images/image`
        : '');

  const alignment = data.alignment || 'left';

  const blocks = properties.blocks || {};
  const blocks_layout = properties.blocks_layout || {};
  const tocEntries = [];

  if (data.useTOC) {
    blocks_layout.items.forEach((blockId) => {
      const block = blocks[blockId];
      if (block?.['@type'] === 'slate') {
        const value = block.value || [];
        value.forEach((node) => {
          const type = node.type;
          if (['heading-one', 'heading-two', 'heading-three', 'h1', 'h2', 'h3'].includes(type)) {
            const text = node.children?.map((child) => child.text).join('').trim();
            const anchor = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            tocEntries.push({ title: text, id: anchor });
          }
        });
      }
    });
  }

  return (
    <div className={`custom-hero-block ${data.isFullWidth ? 'full-width' : ''}`}>
      {videoUrl ? (
        <video
          className="hero-video-bg"
          autoPlay
          muted
          loop
          playsInline
          poster={imageUrl}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <div
          className="hero-image-bg"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      <div className="overlay" />
      <div className={`custom-hero-inner align-${alignment}`}>
        <div className="custom-hero-content">
          {displayTitle && <h1>{displayTitle}</h1>}
          {displaySubtitle && <h3>{displaySubtitle}</h3>}
        </div>
        {(data.useTOC ? tocEntries.length > 0 : data.buttons?.length > 0) && (
          <div className={`custom-hero-buttons${data.smallButtons ? ' small-buttons' : ''}`}>
            {data.useTOC
              ? tocEntries.map((entry, i) => (
                  <a key={i} href={`#${entry.id}`} className="hero-button">
                    {entry.title}
                  </a>
                ))
              : data.buttons.map((btn, i) => (
                  <a key={i} href={getHref(btn.link)} className="hero-button">
                    {btn.label || 'Click here'}
                  </a>
                ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default View;