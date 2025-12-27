// @keepTs
// @ts-nocheck
import { VerifyCodeResult } from "../f";
export declare class VerifyCodeResultImpl implements VerifyCodeResult {
    private shortestInterval;
    private validityPeriod;
    constructor(h3: string, validityPeriod: string);
    getShortestInterval(): string;
    getValidityPeriod(): string;
}
