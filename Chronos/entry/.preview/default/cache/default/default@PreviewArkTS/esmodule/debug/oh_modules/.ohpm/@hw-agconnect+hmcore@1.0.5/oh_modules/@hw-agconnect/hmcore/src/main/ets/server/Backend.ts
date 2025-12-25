import List from "@ohos:util.List";
import type http from "@ohos:net.http";
import { CallServerInterceptor } from "@normalized:N&&&@hw-agconnect/hmcore/src/main/ets/base/net/CallServerInterceptor&1.0.5";
import type { Interceptor } from '../base/net/Interceptor';
import { RealInterceptorChain } from "@normalized:N&&&@hw-agconnect/hmcore/src/main/ets/base/net/RealInterceptorChain&1.0.5";
import { BackupInterceptor } from "@normalized:N&&&@hw-agconnect/hmcore/src/main/ets/base/net/BackupInterceptor&1.0.5";
import { ClientTokenInterceptor } from "@normalized:N&&&@hw-agconnect/hmcore/src/main/ets/base/net/ClientTokenInterceptor&1.0.5";
import { AGCError } from "@normalized:N&&&@hw-agconnect/hmcore/src/main/ets/error/AGCError&1.0.5";
import type { BaseRequest } from './BaseRequest';
import { ApiInterceptor } from "@normalized:N&&&@hw-agconnect/hmcore/src/main/ets/base/net/ApiInterceptor&1.0.5";
import { LoggerInterceptor } from "@normalized:N&&&@hw-agconnect/hmcore/src/main/ets/base/net/LoggerInterceptor&1.0.5";
export class Backend {
    static async post(request: BaseRequest, options?: HttpOptions, interceptors?: List<Interceptor>): Promise<any> {
        return this.sendRequest('POST', request, options, interceptors);
    }
    static async sendRequest(method: Method, baseRequest: BaseRequest, options?: HttpOptions, interceptors?: List<Interceptor>): Promise<any> {
        let list: List<Interceptor> = new List();
        if (interceptors && interceptors.length > 0) {
            list = interceptors;
        }
        list.add(new LoggerInterceptor(baseRequest.region(), baseRequest.sdkInfo()));
        if (baseRequest.url().back) {
            list.add(new BackupInterceptor(baseRequest.url().main, baseRequest.url().back));
        }
        if (options && options.clientToken) {
            list.add(new ClientTokenInterceptor(baseRequest.region()));
        }
        list.add(new ApiInterceptor(baseRequest.sdkInfo()));
        list.add(new CallServerInterceptor());
        let request_ = {
            url: baseRequest.url().main,
            method: method as http.RequestMethod,
            header: await baseRequest.header(),
            body: await baseRequest.body(),
            readTimeout: options?.readTimeout,
            connectTimeout: options?.connectTimeout
        };
        let realInterceptorChain = new RealInterceptorChain(list, 0, request_);
        let response = await realInterceptorChain.proceed(request_);
        if (response && response.responseCode == 200) {
            return Promise.resolve(response.result);
        }
        else {
            let message = response?.message;
            if (!message) {
                message = response?.result?.toString();
            }
            return Promise.reject(new AGCError(response?.responseCode, message));
        }
    }
}
export interface HttpOptions {
    clientToken?: boolean;
    readTimeout?: number;
    connectTimeout?: number;
}
export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
