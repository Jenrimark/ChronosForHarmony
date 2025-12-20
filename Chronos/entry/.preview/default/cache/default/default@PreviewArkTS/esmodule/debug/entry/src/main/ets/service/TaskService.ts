import { Task } from "@normalized:N&&&entry/src/main/ets/model/Task&";
import type { TaskJSON } from "@normalized:N&&&entry/src/main/ets/model/Task&";
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import { Utils } from "@normalized:N&&&entry/src/main/ets/common/Utils&";
import { ApiClient } from "@normalized:N&&&entry/src/main/ets/common/ApiClient&";
/**
 * 任务查询参数类
 */
class TaskQueryParams {
    status?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
}
/**
 * 任务服务类 - 通过API调用后端
 */
export class TaskService {
    private static instance: TaskService;
    private apiClient: ApiClient = ApiClient.getInstance();
    private constructor() {
        // 初始化API客户端
        this.apiClient.setBaseUrl(Constants.API_BASE_URL);
    }
    static getInstance(): TaskService {
        if (!TaskService.instance) {
            TaskService.instance = new TaskService();
        }
        return TaskService.instance;
    }
    /**
     * 创建任务
     */
    async createTask(task: Task): Promise<Task> {
        try {
            const taskData = task.toJSON();
            const response = await this.apiClient.post<TaskJSON>('/tasks', taskData);
            return Task.fromJSON(response.data);
        }
        catch (error) {
            console.error('创建任务失败:', error);
            throw error instanceof Error ? error : new Error(String(error));
        }
    }
    /**
     * 更新任务
     */
    async updateTask(task: Task): Promise<void> {
        try {
            const taskData = task.toJSON();
            await this.apiClient.put<TaskJSON>(`/tasks/${task.id}`, taskData);
        }
        catch (error) {
            console.error('更新任务失败:', error);
            throw error instanceof Error ? error : new Error(String(error));
        }
    }
    /**
     * 删除任务
     */
    async deleteTask(id: number): Promise<void> {
        try {
            await this.apiClient.delete<Record<string, any>>(`/tasks/${id}`);
        }
        catch (error) {
            console.error('删除任务失败:', error);
            throw error instanceof Error ? error : new Error(String(error));
        }
    }
    /**
     * 获取任务
     */
    async getTask(id: number): Promise<Task | null> {
        try {
            const response = await this.apiClient.get<TaskJSON>(`/tasks/${id}`);
            return Task.fromJSON(response.data);
        }
        catch (error) {
            console.error('获取任务失败:', error);
            return null;
        }
    }
    /**
     * 获取所有任务
     */
    async getAllTasks(): Promise<Task[]> {
        try {
            const response = await this.apiClient.get<TaskJSON[]>('/tasks');
            return response.data.map(json => Task.fromJSON(json));
        }
        catch (error) {
            console.error('获取任务列表失败:', error);
            return [];
        }
    }
    /**
     * 获取待办任务
     */
    async getPendingTasks(): Promise<Task[]> {
        return await this.getTasksByStatus(Constants.TASK_STATUS_PENDING);
    }
    /**
     * 获取进行中的任务
     */
    async getInProgressTasks(): Promise<Task[]> {
        return await this.getTasksByStatus(Constants.TASK_STATUS_IN_PROGRESS);
    }
    /**
     * 获取已完成的任务
     */
    async getCompletedTasks(): Promise<Task[]> {
        return await this.getTasksByStatus(Constants.TASK_STATUS_COMPLETED);
    }
    /**
     * 根据状态获取任务
     */
    async getTasksByStatus(status: string): Promise<Task[]> {
        try {
            const params = new TaskQueryParams();
            params.status = status;
            const response = await this.apiClient.get<TaskJSON[]>('/tasks', params as Record<string, any>);
            return response.data.map(json => Task.fromJSON(json));
        }
        catch (error) {
            console.error('获取任务列表失败:', error);
            return [];
        }
    }
    /**
     * 完成任务
     */
    async completeTask(task: Task): Promise<void> {
        try {
            const response = await this.apiClient.post<TaskJSON>(`/tasks/${task.id}/complete`);
            // 更新本地任务对象
            const updatedTask = Task.fromJSON(response.data);
            task.status = updatedTask.status;
            task.completedTime = updatedTask.completedTime;
            task.updateTime = updatedTask.updateTime;
        }
        catch (error) {
            console.error('完成任务失败:', error);
            throw error instanceof Error ? error : new Error(String(error));
        }
    }
    /**
     * 取消完成任务
     */
    async uncompleteTask(task: Task): Promise<void> {
        try {
            const response = await this.apiClient.post<TaskJSON>(`/tasks/${task.id}/uncomplete`);
            // 更新本地任务对象
            const updatedTask = Task.fromJSON(response.data);
            task.status = updatedTask.status;
            task.completedTime = updatedTask.completedTime;
            task.updateTime = updatedTask.updateTime;
        }
        catch (error) {
            console.error('取消完成任务失败:', error);
            throw error instanceof Error ? error : new Error(String(error));
        }
    }
    /**
     * 获取指定日期的任务
     */
    async getTasksByDate(date: Date): Promise<Task[]> {
        try {
            const dateStr = date.toISOString();
            const params = new TaskQueryParams();
            params.date = dateStr;
            const response = await this.apiClient.get<TaskJSON[]>('/tasks', params as Record<string, any>);
            return response.data.map(json => Task.fromJSON(json));
        }
        catch (error) {
            console.error('获取任务列表失败:', error);
            return [];
        }
    }
    /**
     * 获取指定日期范围的任务
     */
    async getTasksByDateRange(startDate: Date, endDate: Date): Promise<Task[]> {
        try {
            const startDateStr = startDate.toISOString();
            const endDateStr = endDate.toISOString();
            const params = new TaskQueryParams();
            params.startDate = startDateStr;
            params.endDate = endDateStr;
            const response = await this.apiClient.get<TaskJSON[]>('/tasks', params as Record<string, any>);
            return response.data.map(json => Task.fromJSON(json));
        }
        catch (error) {
            console.error('获取任务列表失败:', error);
            return [];
        }
    }
    /**
     * 获取今日任务
     */
    async getTodayTasks(): Promise<Task[]> {
        const today = new Date();
        return await this.getTasksByDate(today);
    }
    /**
     * 获取本周任务
     */
    async getWeekTasks(): Promise<Task[]> {
        const today = new Date();
        const weekStart = Utils.getWeekStart(today);
        const weekEnd = Utils.getWeekEnd(today);
        return await this.getTasksByDateRange(weekStart, weekEnd);
    }
    /**
     * 获取本月任务
     */
    async getMonthTasks(): Promise<Task[]> {
        const today = new Date();
        const monthStart = Utils.getMonthStart(today);
        const monthEnd = Utils.getMonthEnd(today);
        return await this.getTasksByDateRange(monthStart, monthEnd);
    }
}
