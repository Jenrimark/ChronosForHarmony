# Git 分支管理工作流

## 分支结构

本项目采用标准的分支管理策略，包含以下分支：

- **main**: 主分支，用于生产环境，只接受来自 `develop` 分支的合并
- **develop**: 开发分支，用于日常开发和功能集成

## 分支命名规范

### 功能分支 (Feature)
```
feature/功能名称
例如: feature/user-authentication
```

### 修复分支 (Bugfix)
```
bugfix/问题描述
例如: bugfix/login-error
```

### 热修复分支 (Hotfix)
```
hotfix/紧急修复描述
例如: hotfix/security-patch
```

### 发布分支 (Release)
```
release/版本号
例如: release/v1.0.0
```

## 工作流程

### 1. 开发新功能

```bash
# 从 develop 分支创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# 开发完成后提交
git add .
git commit -m "feat: 添加新功能描述"

# 推送到远程仓库
git push origin feature/your-feature-name

# 在 develop 分支合并功能分支
git checkout develop
git merge feature/your-feature-name
git push origin develop
```

### 2. 修复 Bug

```bash
# 从 develop 分支创建修复分支
git checkout develop
git pull origin develop
git checkout -b bugfix/your-bug-description

# 修复完成后提交
git add .
git commit -m "fix: 修复问题描述"

# 推送到远程仓库
git push origin bugfix/your-bug-description

# 在 develop 分支合并修复分支
git checkout develop
git merge bugfix/your-bug-description
git push origin develop
```

### 3. 发布新版本

```bash
# 从 develop 分支创建发布分支
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0

# 进行版本号更新、文档完善等
# 提交发布准备
git add .
git commit -m "chore: 准备发布 v1.0.0"

# 合并到 main 分支
git checkout main
git merge release/v1.0.0
git tag -a v1.0.0 -m "发布版本 v1.0.0"
git push origin main --tags

# 合并回 develop 分支
git checkout develop
git merge release/v1.0.0
git push origin develop
```

### 4. 紧急热修复

```bash
# 从 main 分支创建热修复分支
git checkout main
git pull origin main
git checkout -b hotfix/your-hotfix-description

# 修复完成后提交
git add .
git commit -m "fix: 紧急修复描述"

# 合并到 main 分支
git checkout main
git merge hotfix/your-hotfix-description
git tag -a v1.0.1 -m "热修复版本 v1.0.1"
git push origin main --tags

# 合并回 develop 分支
git checkout develop
git merge hotfix/your-hotfix-description
git push origin develop
```

## 提交信息规范

使用约定式提交 (Conventional Commits) 格式：

```
<类型>(<范围>): <描述>

[可选的正文]

[可选的脚注]
```

### 提交类型

- **feat**: 新功能
- **fix**: 修复 Bug
- **docs**: 文档更新
- **style**: 代码格式调整（不影响功能）
- **refactor**: 代码重构
- **perf**: 性能优化
- **test**: 测试相关
- **chore**: 构建过程或辅助工具的变动
- **ci**: CI/CD 配置变更

### 示例

```bash
git commit -m "feat(backend): 添加用户认证功能"
git commit -m "fix(frontend): 修复任务列表显示问题"
git commit -m "docs: 更新 API 文档"
git commit -m "refactor(backend): 重构任务服务层"
```

## 常用命令

### 查看分支
```bash
# 查看本地分支
git branch

# 查看所有分支（包括远程）
git branch -a

# 查看分支关系
git log --oneline --graph --all
```

### 切换分支
```bash
# 切换到指定分支
git checkout branch-name

# 创建并切换到新分支
git checkout -b new-branch-name
```

### 更新分支
```bash
# 拉取远程更新
git pull origin branch-name

# 获取远程更新（不合并）
git fetch origin
```

### 合并分支
```bash
# 合并指定分支到当前分支
git merge branch-name

# 使用 rebase 方式合并（保持线性历史）
git rebase branch-name
```

### 删除分支
```bash
# 删除本地分支
git branch -d branch-name

# 强制删除本地分支
git branch -D branch-name

# 删除远程分支
git push origin --delete branch-name
```

## 注意事项

1. **不要直接在 main 分支开发**：所有开发工作应在功能分支进行
2. **定期同步 develop 分支**：保持 develop 分支与远程同步
3. **提交前检查**：确保代码可以正常编译和运行
4. **提交信息清晰**：使用规范的提交信息格式
5. **及时清理分支**：合并后的功能分支应及时删除

## 项目结构

```
Chronos/
├── Back/          # 后端代码 (Spring Boot)
├── Chronos/       # 前端代码 (HarmonyOS)
├── .gitignore     # Git 忽略文件配置
└── README.md      # 项目说明
```

## 远程仓库配置

如果还没有配置远程仓库，可以使用以下命令：

```bash
# 添加远程仓库
git remote add origin <repository-url>

# 查看远程仓库
git remote -v

# 首次推送
git push -u origin main
git push -u origin develop
```

---

**最后更新**: 2024年12月

