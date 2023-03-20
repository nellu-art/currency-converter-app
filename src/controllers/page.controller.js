// we can block by resrouce type like fonts, images etc.
const blockResourceType = [
  'beacon',
  'csp_report',
  'font',
  'image',
  'imageset',
  'media',
  'object',
  'texttrack',
];
// we can also block by domains, like google-analytics etc.
const blockResourceName = [
  'adition',
  'adzerk',
  'analytics',
  'cdn.api.twitter',
  'clicksor',
  'clicktale',
  'doubleclick',
  'exelator',
  'facebook',
  'fontawesome',
  // 'google',
  'google-analytics',
  'googletagmanager',
  'mixpanel',
  'optimizely',
  'quantserve',
  'sharethrough',
  'tiqcdn',
  'zedo',
];

export async function createPage(browser) {
  const page = await browser.newPage();
  // we need to enable interception feature
  await page.setRequestInterception(true);

  // then we can add a call back which inspects every
  // outgoing request browser makes and decides whether to allow it
  page.on('request', (request) => {
    const requestUrl = request.url().split('?')[0];
    if (
      request.resourceType() in blockResourceType ||
      blockResourceName.some((resource) => requestUrl.includes(resource))
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });

  return page;
}
