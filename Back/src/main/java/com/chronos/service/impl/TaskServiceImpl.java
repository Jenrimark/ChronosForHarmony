package com.chronos.service.impl;

import com.chronos.entity.Task;
import com.chronos.exception.BusinessException;
import com.chronos.common.ResultCode;
import com.chronos.repository.TaskRepository;
import com.chronos.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Override
    public List<Task> getAllTasks(String status, LocalDateTime date, LocalDateTime startDate, LocalDateTime endDate) {
        if (status != null && startDate != null && endDate != null) {
            return taskRepository.findByStatusAndDateRange(status, startDate, endDate);
        } else if (status != null) {
            return taskRepository.findByStatus(status);
        } else if (date != null) {
            return taskRepository.findByDate(date);
        } else if (startDate != null && endDate != null) {
            return taskRepository.findByDateRange(startDate, endDate);
        } else {
            return taskRepository.findAll();
        }
    }

    @Override
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    @Override
    @Transactional
    public Task createTask(Task task) {
        if (task.getStatus() == null) {
            task.setStatus("pending");
        }
        if (task.getPriority() == null) {
            task.setPriority(2);
        }
        return taskRepository.save(task);
    }

    @Override
    @Transactional
    public Task updateTask(Long id, Task task) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));
        
        if (task.getTitle() != null) {
            existingTask.setTitle(task.getTitle());
        }
        if (task.getDescription() != null) {
            existingTask.setDescription(task.getDescription());
        }
        if (task.getStatus() != null) {
            existingTask.setStatus(task.getStatus());
        }
        if (task.getPriority() != null) {
            existingTask.setPriority(task.getPriority());
        }
        if (task.getDueDate() != null) {
            existingTask.setDueDate(task.getDueDate());
        }
        if (task.getTags() != null) {
            existingTask.setTags(task.getTags());
        }
        
        return taskRepository.save(existingTask);
    }

    @Override
    @Transactional
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        taskRepository.deleteById(id);
    }

    @Override
    @Transactional
    public Task completeTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));
        task.setStatus("completed");
        task.setCompletedTime(LocalDateTime.now());
        return taskRepository.save(task);
    }

    @Override
    @Transactional
    public Task uncompleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));
        task.setStatus("pending");
        task.setCompletedTime(null);
        return taskRepository.save(task);
    }
}

