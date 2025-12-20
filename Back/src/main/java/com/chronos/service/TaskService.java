package com.chronos.service;

import com.chronos.entity.Task;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TaskService {
    List<Task> getAllTasks(String status, LocalDateTime date, LocalDateTime startDate, LocalDateTime endDate);
    Optional<Task> getTaskById(Long id);
    Task createTask(Task task);
    Task updateTask(Long id, Task task);
    void deleteTask(Long id);
    Task completeTask(Long id);
    Task uncompleteTask(Long id);
}

