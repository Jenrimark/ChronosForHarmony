package com.chronos.controller;

import com.chronos.common.Result;
import com.chronos.entity.Task;
import com.chronos.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public Result<List<Task>> getAllTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<Task> tasks = taskService.getAllTasks(status, date, startDate, endDate);
        return Result.success(tasks);
    }

    @GetMapping("/{id}")
    public Result<Task> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(Result::success)
                .orElse(Result.error(404, "任务不存在"));
    }

    @PostMapping
    public Result<Task> createTask(@RequestBody Task task) {
        Task createdTask = taskService.createTask(task);
        return Result.success(createdTask);
    }

    @PutMapping("/{id}")
    public Result<Task> updateTask(@PathVariable Long id, @RequestBody Task task) {
        Task updatedTask = taskService.updateTask(id, task);
        return Result.success(updatedTask);
    }

    @DeleteMapping("/{id}")
    public Result<?> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return Result.success(null);
    }

    @PostMapping("/{id}/complete")
    public Result<Task> completeTask(@PathVariable Long id) {
        Task task = taskService.completeTask(id);
        return Result.success(task);
    }

    @PostMapping("/{id}/uncomplete")
    public Result<Task> uncompleteTask(@PathVariable Long id) {
        Task task = taskService.uncompleteTask(id);
        return Result.success(task);
    }
}

