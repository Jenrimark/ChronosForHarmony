import { AGCError } from "@normalized:N&&&@hw-agconnect/hmcore/src/main/ets/error/AGCError&1.0.5";
export enum CoreErrorCode {
    INIT_ERROR = 1100001,
    JSON_FILE_ERROR = 1100002,
    DATASTORE_ERROR = 1100003
}
export function error(code: CoreErrorCode, message: string) {
    return new AGCError(code, message);
}
