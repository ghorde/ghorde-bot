export class TimeoutManager {
    private static _instance: TimeoutManager;
    private _timeouts: Map<string, NodeJS.Timeout>;

    private constructor() {
        this._timeouts = new Map();
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    public addTimeout(key: string, timeout: NodeJS.Timeout) {
        this._timeouts.set(key, timeout);
    }

    public removeTimeout(key: string) {
        this._timeouts.delete(key);
    }

    public getTimeout(key: string) {
        return this._timeouts.get(key);
    }
}

export class BotRateLimiter {
    private _ratelimits: Map<string, number>;

    constructor() {
        this._ratelimits = new Map();
    }

    public addRateLimit(key: string, ratelimit: number) {
        this._ratelimits.set(key, ratelimit);
    }

    public removeRateLimit(key: string) {
        this._ratelimits.delete(key);
    }

    public getRateLimit(key: string) {
        return this._ratelimits.get(key);
    }

    public async checkRateLimit(key: string) {
        const rateLimit = this._ratelimits.get(key);
        if (rateLimit) {
            const timeout = TimeoutManager.Instance.getTimeout(`${key}`);
            if (timeout) {
                return false;
            } else {
                TimeoutManager.Instance.addTimeout(`${key}`, setTimeout(() => {
                    TimeoutManager.Instance.removeTimeout(`${key}`);
                }, rateLimit));
                return true;
            }
        } else {
            return true;
        }
    }
}

export class UserRateLimiter {
    private _ratelimits: Map<string, number>;

    constructor() {
        this._ratelimits = new Map();
    }

    public addRateLimit(key: string, ratelimit: number) {
        this._ratelimits.set(key, ratelimit);
    }

    public removeRateLimit(key: string) {
        this._ratelimits.delete(key);
    }

    public getRateLimit(key: string) {
        return this._ratelimits.get(key);
    }

    public async checkRateLimit(key: string, userId: string) {
        const rateLimit = this._ratelimits.get(key);
        if (rateLimit) {
            const timeout = TimeoutManager.Instance.getTimeout(`${key}-${userId}`);
            if (timeout) {
                return false;
            } else {
                TimeoutManager.Instance.addTimeout(`${key}-${userId}`, setTimeout(() => {
                    TimeoutManager.Instance.removeTimeout(`${key}-${userId}`);
                }, rateLimit));
                return true;
            }
        } else {
            return true;
        }
    }
}