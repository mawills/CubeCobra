interface MetaObject {
  property: string;
  content: string;
}

/**
 * TODO: what am i? Seems some params are optional
 *
 * @param {string} title
 * @param {string} description
 * @param {string} image
 * @param {string} url
 * @param {string} width
 * @param {string} height
 */
const generateMeta = function(
  title: string,
  description: string,
  image: string,
  url: string,
  width: string,
  height: string,
): MetaObject[] {
  return [
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      property: 'og:image',
      content: image,
    },
    {
      property: 'og:url',
      content: url,
    },
    {
      property: 'og:image:width',
      content: width ? width : '',
    },
    {
      property: 'og:image:height',
      content: height ? height : '',
    },
    {
      property: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      property: 'twitter:title',
      content: title,
    },
    {
      property: 'twitter:description',
      content: description,
    },
    {
      property: 'twitter:image',
      content: image,
    },
    {
      property: 'twitter:url',
      content: url,
    },
  ];
};

module.exports = generateMeta;
