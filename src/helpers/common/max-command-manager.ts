export class MaxCommandCountManager {
  private _ratelimits: Map<string, number>;

  constructor() {
    this._ratelimits = new Map();
  }

  public addCommandToUser(key: string) {
    const count = this._ratelimits.get(key);
    if (count) {
      this._ratelimits.set(key, count + 1);
    } else {
      this._ratelimits.set(key, 1);
    }
  }
}
