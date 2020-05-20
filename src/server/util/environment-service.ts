import { readFileSync } from 'fs';

export class EnvironmentService {
  private static _instance: EnvironmentService;
  private static get instance() {
    if (!this._instance) {
      this._instance = new EnvironmentService();
    }
    return this._instance;
  }

  private configFile = {};

  private constructor() {
    try {
      this.configFile = JSON.parse(readFileSync('secrets.json') as any);
    } catch (error) { console.error(error); }
  }

  private getValue(key: string) {
    return this.configFile[key] || process.env[key];
  }

  static get googleEmail() {
    return this.instance.getValue('googleEmail');
  }

  static get googleAuthKey() {
    return this.instance.getValue('googleAuthKey').replace(/\\n/gm, '\n');
  }

  static get sessionSecret() {
    return this.instance.getValue('sessionSecret');
  }

}
