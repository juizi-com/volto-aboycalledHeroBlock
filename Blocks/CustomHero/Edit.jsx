import React from 'react';
import { SidebarPortal, BlockDataForm } from '@plone/volto/components';
import schema from './schema';
import './style.css';

const getHref = (link) => {
  const item = Array.isArray(link) ? link[0] : link;
  return item?.['@id'] || '#';
};

const updateButtonLabelIfEmpty = (buttons) => {
  return buttons.map((btn) => {
    const link = Array.isArray(btn.link) ? btn.link[0] : btn.link;
    const label = btn.label?.trim();
    if (!label && link && (link.title || link['@id'])) {
      return {
        ...btn,
        label: link.title || link['@id'].split('/').filter(Boolean).pop(),
      };
    }
    return btn;
  });
};

const extractTOCEntries = (blocks, layout = []) => {
  const entries = [];

  layout.forEach((blockId) => {
    const block = blocks[blockId];
    if ((block?.['@type'] === 'text' || block?.['@type'] === 'slate') && Array.isArray(block.value)) {
      block.value.forEach((node) => {
        if (
          ['heading-one', 'heading-two', 'heading-three', 'h1', 'h2', 'h3'].includes(node.type)
        ) {
          const text = node.children?.map((child) => child.text).join('').trim();
          const anchor = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          if (text) {
            entries.push({ id: anchor, title: text });
          }
        }
      });
    }
  });

  return entries;
};

const Edit = (props) => {
  const { data, block, onChangeBlock, selected } = props;
  const blocks = props?.properties?.blocks || {};
  const layout = props?.properties?.blocks_layout?.items || [];
  const tocEntries = extractTOCEntries(blocks, layout);

  const imageItem = Array.isArray(data.backgroundImage)
    ? data.backgroundImage[0]
    : data.backgroundImage;

  const baseUrl = props.properties?.['@id'] || '';
  const pageTitle = props.properties?.title || '';
  const pageDescription = props.properties?.description || '';
  const displayTitle = data.usePageTitle ? pageTitle : data.title;
  const displaySubtitle = data.usePageDescription ? pageDescription : data.subtitle;

  const imageUrl = data.usePreviewImage
    ? `${baseUrl}/@@images/preview_image`
    : (imageItem?.['@id']
        ? `${imageItem['@id']}/@@images/image`
        : imageItem?.download || '');

  const rawId = data?.backgroundVideo?.[0]?.['@id'] || '';
  const filename = rawId.split('/').filter(Boolean).pop();
  const isAlreadyDownloadUrl = rawId.includes('/@@download/');
  const videoUrl = rawId && filename
    ? (isAlreadyDownloadUrl ? rawId : `${rawId}/@@download/file/${filename}`)
    : null;

  return (
    <>
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
        <div className={`custom-hero-inner align-${data.alignment || 'left'}`}>
          <div className="custom-hero-content">
            {displayTitle && <h1>{displayTitle}</h1>}
            {displaySubtitle && <h3>{displaySubtitle}</h3>}
          </div>

          {data.useTOC ? (
            <div className={`custom-hero-buttons${data.smallButtons ? ' small-buttons' : ''}`}>
              {tocEntries.map((entry, i) => (
                <a key={i} href={`#${entry.id}`} className="hero-button">
                  {entry.title}
                </a>
              ))}
            </div>
          ) : (
            data.buttons?.length > 0 && (
              <div className={`custom-hero-buttons${data.smallButtons ? ' small-buttons' : ''}`}>
                {data.buttons.map((btn, i) => (
                  <a key={i} href={getHref(btn.link)} className="hero-button">
                    {btn.label || 'Click here'}
                  </a>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {selected && (
        <SidebarPortal selected={selected}>
          <BlockDataForm
            schema={{
              ...schema(props),
              fieldsets: schema(props).fieldsets.map((fs) => {
                let fields = fs.fields;

                if (data.usePageTitle) {
                  fields = fields.filter((field) => field !== 'title');
                }

                if (data.usePageDescription) {
                  fields = fields.filter((field) => field !== 'subtitle');
                }

                if (data.useTOC) {
                  fields = fields.filter((field) => field !== 'buttons');
                }

                if (data.usePreviewImage) {
                  fields = fields.filter((field) => field !== 'backgroundImage');
                }

                return {
                  ...fs,
                  fields,
                };
              }),
            }}
            title="Hero Block"
            onChangeField={(id, value) =>
              onChangeBlock(block, { ...data, [id]: value })
            }
            onChangeBlock={(id, newData) => {
              const updated = { ...data, ...newData };
              if (newData.buttons) {
                updated.buttons = updateButtonLabelIfEmpty(newData.buttons);
              }
              onChangeBlock(id, updated);
            }}
            block={block}
            formData={data}
          />
        </SidebarPortal>
      )}
    </>
  );
};

export default Edit;