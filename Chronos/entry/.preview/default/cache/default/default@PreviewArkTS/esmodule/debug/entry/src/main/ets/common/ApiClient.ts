import http from "@ohos:net.http";
import type { BusinessError as BusinessError } from "@ohos:base";
/**
 * API响应接口
 */
export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}
/**
 * HTTP客户端类 - 封装网络请求
 */
export class ApiClient {
    private static instance: ApiClient;
    private baseUrl: string = 'http://localhost:8080/api'; // 默认后端地址，需要根据实际情况修改
    private token: string = ''; // 认证token
    private constructor() { }
    static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }
    /**
     * 设置基础URL
     */
    setBaseUrl(url: string): void {
        this.baseUrl = url;
    }
    /**
     * 设置认证Token
     */
    setToken(token: string): void {
        this.token = token;
    }
    /**
     * 获取认证Token
     */
    getToken(): string {
        return this.token;
    }
    /**
     * 构建请求头
     */
    private buildHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }
    /**
     * 处理响应
     */
    private async handleResponse<T>(response: http.HttpResponse): Promise<ApiResponse<T>> {
        const result = await response.result.toString();
        const data: ApiResponse<T> = JSON.parse(result);
        if (data.code !== 200 && data.code !== 0) {
            throw new Error(data.message || '请求失败');
        }
        return data;
    }
    /**
     * GET请求
     */
    async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
        try {
            let fullUrl = `${this.baseUrl}${url}`;
            // 添加查询参数
            if (params) {
                const queryParts: string[] = [];
                const keys = Object.keys(params);
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    if (params[key] !== undefined && params[key] !== null) {
                        queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(params[key]))}`);
                    }
                }
                if (queryParts.length > 0) {
                    fullUrl += `?${queryParts.join('&')}`;
                }
            }
            const httpRequest = http.createHttp();
            const response = await httpRequest.request(fullUrl, {
                method: http.RequestMethod.GET,
                header: this.buildHeaders()
            });
            return await this.handleResponse<T>(response);
        }
        catch (err) {
            const error = err as BusinessError;
            console.error('GET请求失败:', JSON.stringify(error));
            throw new Error(`请求失败: ${error.message || '未知错误'}`);
        }
    }
    /**
     * POST请求
     */
    async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
        try {
            const httpRequest = http.createHttp();
            const response = await httpRequest.request(`${this.baseUrl}${url}`, {
                method: http.RequestMethod.POST,
                header: this.buildHeaders(),
                extraData: data ? JSON.stringify(data) : undefined
            });
            return await this.handleResponse<T>(response);
        }
        catch (err) {
            const error = err as BusinessError;
            console.error('POST请求失败:', JSON.stringify(error));
            throw new Error(`请求失败: ${error.message || '未知错误'}`);
        }
    }
    /**
     * PUT请求
     */
    async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
        try {
            const httpRequest = http.createHttp();
            const response = await httpRequest.request(`${this.baseUrl}${url}`, {
                method: http.RequestMethod.PUT,
                header: this.buildHeaders(),
                extraData: data ? JSON.stringify(data) : undefined
            });
            return await this.handleResponse<T>(response);
        }
        catch (err) {
            const error = err as BusinessError;
            console.error('PUT请求失败:', JSON.stringify(error));
            throw new Error(`请求失败: ${error.message || '未知错误'}`);
        }
    }
    /**
     * DELETE请求
     */
    async delete<T>(url: string): Promise<ApiResponse<T>> {
        try {
            const httpRequest = http.createHttp();
            const response = await httpRequest.request(`${this.baseUrl}${url}`, {
                method: http.RequestMethod.DELETE,
                header: this.buildHeaders()
            });
            return await this.handleResponse<T>(response);
        }
        catch (err) {
            const error = err as BusinessError;
            console.error('DELETE请求失败:', JSON.stringify(error));
            throw new Error(`请求失败: ${error.message || '未知错误'}`);
        }
    }
}
