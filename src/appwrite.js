import { Client, Databases } from 'node-appwrite';

/**
 * @typedef {Object} URLEntry
 * @property {string} url
 *
 * @typedef {import('node-appwrite').Models.Document & URLEntry} URLEntryDocument
 */

class AppwriteService {
  constructor() {
    const client = new Client();
    client
      .setEndpoint(
        process.env.APPWRITE_ENDPOINT ?? 'https://cloud.appwrite.io/v1'
      )
      .setProject("656e2c43a574f664ebd8")
      .setKey("b4b185ddcb3094dcb2733d589b1deb8b136dc982ef7084cf274ead3a17dd726e458a7c11075d4f43056cfeab9556788ff1702c0f3fe6ca87592bbeb8792ee159a29dc381aa8ea6d97d71f0815c62c7048a9ef524dc0755319317b3964414aa40adfb8d160e0859ed593a30f9cfa5559e41fc28379399f676d5f347950383e3c8");

    this.databases = new Databases(client);
  }

  /**
   * @param {string} shortCode
   * @returns {Promise<URLEntryDocument | null>}
   */
  async getURLEntry(shortCode) {
    try {
      const document = /** @type {URLEntryDocument} */ (
        await this.databases.getDocument(
          "656e2d6d5ee9c0a6c953",
          "656e2f4485d720af38f2",
          shortCode
        )
      );

      return document;
    } catch (err) {
      if (err.code !== 404) throw err;
      return null;
    }
  }

  /**
   * @param {string} url
   * @param {string} shortCode
   * @returns {Promise<URLEntryDocument | null>}
   */
  async createURLEntry(url, shortCode) {
    try {
      const document = /** @type {URLEntryDocument} */ (
        await this.databases.createDocument(
          "656e2d6d5ee9c0a6c953",
          "656e2f4485d720af38f2",
          shortCode,
          {
            url,
          }
        )
      );

      return document;
    } catch (err) {
      if (err.code !== 409) throw err;
      return null;
    }
  }

  /**
   * @returns {Promise<boolean>}
   */
  async doesURLEntryDatabaseExist() {
    try {
      await this.databases.get("656e2d6d5ee9c0a6c953");
      return true;
    } catch (err) {
      if (err.code !== 404) throw err;
      return false;
    }
  }

  async setupURLEntryDatabase() {
    try {
      await this.databases.create(
        "656e2d6d5ee9c0a6c953",
        'URL Shortener'
      );
    } catch (err) {
      // If resource already exists, we can ignore the error
      if (err.code !== 409) throw err;
    }
    try {
      await this.databases.createCollection(
        "656e2d6d5ee9c0a6c953",
        "656e2f4485d720af38f2",
        'URLs'
      );
    } catch (err) {
      if (err.code !== 409) throw err;
    }
    try {
      await this.databases.createUrlAttribute(
        "656e2d6d5ee9c0a6c953",
        "656e2f4485d720af38f2",
        'url',
        true
      );
    } catch (err) {
      if (err.code !== 409) throw err;
    }
  }
}

export default AppwriteService;
