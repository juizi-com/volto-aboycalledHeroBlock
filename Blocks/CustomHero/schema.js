
const schema = (props) => {
  const { intl } = props;

  return {
    title: 'Hero Block',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'title',
          'subtitle',
          'backgroundImage',
          'backgroundVideo',
          'usePageTitle',
          'usePageDescription',
          'usePreviewImage',
          'isFullWidth',
          'alignment',
          'smallButtons',
          'useTOC',
          'buttons',
        ],
      },
    ],
    properties: {
      usePageTitle: {
        title: 'Use page title as block title',
        type: 'boolean',
        default: false,
      },
      usePageDescription: {
        title: 'Use page description as block subtitle',
        type: 'boolean',
        default: false,
      },
      title: {
        title: 'Title',
        type: 'string',
      },
      subtitle: {
        title: 'Subtitle',
        type: 'string',
      },
      backgroundImage: {
        title: 'Background image',
        widget: 'object_browser',
        mode: 'image',
        allowExternals: false,
      },
      backgroundVideo: {
        title: 'Background video',
        widget: 'object_browser',
        mode: 'file',
        allowExternals: false,
        selectableTypes: ['File'],
        description: 'MP4 only. Will autoplay, loop, and stay muted.',
      },
      usePreviewImage: {
        title: 'Use page Preview image',
        type: 'boolean',
        default: false,
      },
      alignment: {
        title: 'Text alignment',
        widget: 'align',
        actions: ['left', 'center', 'right'],
        default: 'left',
      },
      layoutMode: {
        title: 'Layout mode',
        widget: 'align',
        actions: ['left', 'center'],
      },
      isFullWidth: {
        title: 'Full width background',
        type: 'boolean',
        default: false,
      },
      useTOC: {
        title: 'Use TOC instead of buttons',
        type: 'boolean',
        default: false,
      },
      buttons: {
        title: 'Buttons',
        widget: 'object_list',
        schema: {
          title: 'Button',
          fieldsets: [
            {
              id: 'default',
              title: 'Default',
              fields: ['label', 'link'],
            },
          ],
          properties: {
            label: {
              title: 'Label',
              type: 'string',
            },
            link: {
              title: 'Link',
              widget: 'object_browser',
              mode: 'link',
              allowExternals: false,
              multi: false,
              default: null,
            },
          },
          required: [],
        },
      },
      smallButtons: {
        title: 'Use smaller buttons',
        type: 'boolean',
        default: false,
      },
    },
    required: [],
  };
};

export default schema;
