return import AppwriteService from './appwrite.js';
import { generateShortCode } from './utils.js';
// import querystring from 'node:querystring';

export default async ({ res, req, log, error }) => {
  // throwIfMissing(process.env, [
  //   'APPWRITE_API_KEY',
  //   'APPWRITE_DATABASE_ID',
  //   'APPWRITE_COLLECTION_ID',
  //   'SHORT_BASE_URL',
  // ]);

  const appwrite = new AppwriteService();

  if (
    req.method === 'POST' 
    // &&
    // req.headers['content-type'] === 'application/json'
  ) {
    try {
      // throwIfMissing(req.body, ['url']);
       const formData = JSON.parse(req.data);

     const message = {
       url: formData.url,
       shortCode: formData.shortCode,
     }
      new URL(message.url)
      // context.log(message)
      // context.log(formData)
      // return res.send({ ok: true, error: message.url }, 200);
    } catch (err) {
      error(err.message);
      return res.send({ ok: false, error: `${err.message} "yabadabadooo"` }, 400);
    }

    const urlEntry = await appwrite.createURLEntry(
      req.body.url,
      req.body.shortCode ?? generateShortCode()
    );
    if (!urlEntry) {
      error('Failed to create url entry.');
      return res.json({ ok: false, error: 'Failed to create url entry' }, 500);
    }

    return res.json({
      short: new URL(urlEntry.$id, "https://short.app/").toString(),
    });
  }

  const shortId = req.path.replace(/^\/|\/$/g, '');
  log(`Fetching document from with ID: ${shortId}`);

  const urlEntry = await appwrite.getURLEntry(shortId);

  if (!urlEntry) {
    return res.send('Invalid link.', 404);
  }

  return res.redirect(urlEntry.url);
};
