import { ConnectRet } from "@normalized:N&&&@hw-agconnect/hmcore/src/main/ets/server/ConnectRet&1.0.5";
export class BaseResponse {
    ret: ConnectRet = new ConnectRet();
    constructor() { }
    public isSuccess(): boolean {
        return this.ret != null && this.ret.getCode() == 0;
    }
    getRet(): ConnectRet {
        return this.ret;
    }
    setRet(value: ConnectRet) {
        this.ret = value;
    }
    constructResponse(response: any): boolean {
        return false;
    }
}
