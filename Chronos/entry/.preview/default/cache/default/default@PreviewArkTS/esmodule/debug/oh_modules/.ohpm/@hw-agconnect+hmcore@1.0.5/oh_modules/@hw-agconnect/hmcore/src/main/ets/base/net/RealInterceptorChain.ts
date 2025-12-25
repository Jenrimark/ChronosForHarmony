import List from "@ohos:util.List";
import type { Chain, Interceptor } from './Interceptor';
import type { Request } from './Request';
import type { Response } from './Response';
export class RealInterceptorChain implements Chain {
    interceptors = new List<Interceptor>();
    request_: Request;
    index: number;
    constructor(interceptors: List<Interceptor>, index: number, request: Request) {
        this.interceptors = interceptors;
        this.index = index;
        this.request_ = request;
    }
    request(): Request {
        return this.request_;
    }
    async proceed(request: Request): Promise<Response> {
        if (this.index >= this.interceptors.length) {
            return null;
        }
        let next: RealInterceptorChain = new RealInterceptorChain(this.interceptors, this.index + 1, request);
        let interceptor = this.interceptors.get(this.index);
        return interceptor.intercept(next);
    }
}
