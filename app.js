// TaskPlanner Pro - Main Application
class TaskPlannerApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.projects = JSON.parse(localStorage.getItem('projects')) || [];
        this.tags = JSON.parse(localStorage.getItem('tags')) || [];
        this.currentView = 'today';
        this.currentFilter = { priority: 'all', project: 'all', tag: 'all' };
        this.currentSort = 'dueDate';
        this.searchQuery = '';
        this.editingTask = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadProjects();
        this.loadTags();
        this.renderTasks();
        this.updateCounts();
        this.setupNotifications();
        this.checkReminders();
        
        // Check for reminders every minute
        setInterval(() => this.checkReminders(), 60000);
    }

    // Event Binding
    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchView(item.dataset.view);
            });
        });

        // Task Modal
        document.getElementById('newTaskBtn').addEventListener('click', () => this.openTaskModal());
        document.getElementById('closeModalBtn').addEventListener('click', () => this.closeTaskModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeTaskModal());
        document.getElementById('taskForm').addEventListener('submit', (e) => this.saveTask(e));

        // Project Modal
        document.getElementById('newProjectBtn').addEventListener('click', () => this.openProjectModal());
        document.getElementById('closeProjectModalBtn').addEventListener('click', () => this.closeProjectModal());
        document.getElementById('cancelProjectBtn').addEventListener('click', () => this.closeProjectModal());
        document.getElementById('projectForm').addEventListener('submit', (e) => this.saveProject(e));

        // Search
        document.getElementById('searchBtn').addEventListener('click', () => this.toggleSearch());
        document.getElementById('closeSearchBtn').addEventListener('click', () => this.closeSearch());
        document.getElementById('searchInput').addEventListener('input', (e) => this.handleSearch(e));

        // Filters and Sorting
        document.getElementById('sortSelect').addEventListener('change', (e) => this.handleSort(e));
        document.getElementById('priorityFilter').addEventListener('change', (e) => this.handleFilter(e));

        // Subtasks
        document.getElementById('addSubtaskBtn').addEventListener('click', () => this.addSubtaskInput());

        // Recurring tasks
        document.getElementById('taskRecurring').addEventListener('change', (e) => {
            document.getElementById('recurringType').style.display = e.target.checked ? 'block' : 'none';
        });

        // Modal overlay clicks
        document.getElementById('taskModal').addEventListener('click', (e) => {
            if (e.target.id === 'taskModal') this.closeTaskModal();
        });
        document.getElementById('projectModal').addEventListener('click', (e) => {
            if (e.target.id === 'projectModal') this.closeProjectModal();
        });
    }

    // Task Management
    openTaskModal(task = null) {
        this.editingTask = task;
        const modal = document.getElementById('taskModal');
        const form = document.getElementById('taskForm');
        const title = document.getElementById('modalTitle');

        if (task) {
            title.textContent = 'Editar Tarea';
            this.populateTaskForm(task);
        } else {
            title.textContent = 'Nueva Tarea';
            form.reset();
            this.clearSubtasks();
        }

        this.populateProjectSelect();
        modal.classList.add('active');
    }

    closeTaskModal() {
        document.getElementById('taskModal').classList.remove('active');
        this.editingTask = null;
    }

    populateTaskForm(task) {
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskProject').value = task.project || '';
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskDueDate').value = task.dueDate || '';
        document.getElementById('taskDueTime').value = task.dueTime || '';
        document.getElementById('taskTags').value = task.tags ? task.tags.join(', ') : '';
        document.getElementById('taskRecurring').checked = task.recurring || false;
        document.getElementById('recurringType').value = task.recurringType || 'daily';
        document.getElementById('recurringType').style.display = task.recurring ? 'block' : 'none';

        this.clearSubtasks();
        if (task.subtasks) {
            task.subtasks.forEach(subtask => this.addSubtaskInput(subtask));
        }
    }

    saveTask(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const task = {
            id: this.editingTask ? this.editingTask.id : Date.now().toString(),
            title: document.getElementById('taskTitle').value.trim(),
            description: document.getElementById('taskDescription').value.trim(),
            project: document.getElementById('taskProject').value,
            priority: document.getElementById('taskPriority').value,
            dueDate: document.getElementById('taskDueDate').value,
            dueTime: document.getElementById('taskDueTime').value,
            tags: document.getElementById('taskTags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
            recurring: document.getElementById('taskRecurring').checked,
            recurringType: document.getElementById('recurringType').value,
            completed: this.editingTask ? this.editingTask.completed : false,
            createdAt: this.editingTask ? this.editingTask.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            subtasks: this.getSubtasks()
        };

        if (!task.title) {
            this.showNotification('El título es obligatorio', 'error');
            return;
        }

        if (this.editingTask) {
            const index = this.tasks.findIndex(t => t.id === this.editingTask.id);
            this.tasks[index] = task;
            this.showNotification('Tarea actualizada', 'success');
        } else {
            this.tasks.push(task);
            this.showNotification('Tarea creada', 'success');
        }

        // Update tags list
        task.tags.forEach(tag => {
            if (!this.tags.includes(tag)) {
                this.tags.push(tag);
            }
        });

        this.saveTasks();
        this.saveTags();
        this.closeTaskModal();
        this.renderTasks();
        this.updateCounts();
        this.loadTags();
    }

    deleteTask(taskId) {
        if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.saveTasks();
            this.renderTasks();
            this.updateCounts();
            this.showNotification('Tarea eliminada', 'success');
        }
    }

    toggleTaskComplete(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.updatedAt = new Date().toISOString();
            
            if (task.completed && task.recurring) {
                this.createRecurringTask(task);
            }
            
            this.saveTasks();
            this.renderTasks();
            this.updateCounts();
            this.showNotification(
                task.completed ? 'Tarea completada' : 'Tarea marcada como pendiente',
                'success'
            );
        }
    }

    createRecurringTask(originalTask) {
        const newTask = { ...originalTask };
        newTask.id = Date.now().toString();
        newTask.completed = false;
        newTask.createdAt = new Date().toISOString();
        newTask.updatedAt = new Date().toISOString();

        if (newTask.dueDate) {
            const dueDate = new Date(newTask.dueDate);
            switch (newTask.recurringType) {
                case 'daily':
                    dueDate.setDate(dueDate.getDate() + 1);
                    break;
                case 'weekly':
                    dueDate.setDate(dueDate.getDate() + 7);
                    break;
                case 'monthly':
                    dueDate.setMonth(dueDate.getMonth() + 1);
                    break;
            }
            newTask.dueDate = dueDate.toISOString().split('T')[0];
        }

        this.tasks.push(newTask);
        this.saveTasks();
    }

    // Subtasks
    addSubtaskInput(subtask = null) {
        const container = document.getElementById('subtasksList');
        const subtaskDiv = document.createElement('div');
        subtaskDiv.className = 'subtask-item';
        
        subtaskDiv.innerHTML = `
            <input type="checkbox" ${subtask && subtask.completed ? 'checked' : ''}>
            <input type="text" placeholder="Subtarea..." value="${subtask ? subtask.title : ''}">
            <button type="button" class="btn-icon-small" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(subtaskDiv);
    }

    getSubtasks() {
        const subtaskItems = document.querySelectorAll('#subtasksList .subtask-item');
        return Array.from(subtaskItems).map(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            const textInput = item.querySelector('input[type="text"]');
            return {
                title: textInput.value.trim(),
                completed: checkbox.checked
            };
        }).filter(subtask => subtask.title);
    }

    clearSubtasks() {
        document.getElementById('subtasksList').innerHTML = '';
    }

    // Project Management
    openProjectModal() {
        document.getElementById('projectModal').classList.add('active');
        document.getElementById('projectForm').reset();
    }

    closeProjectModal() {
        document.getElementById('projectModal').classList.remove('active');
    }

    saveProject(e) {
        e.preventDefault();
        
        const project = {
            id: Date.now().toString(),
            name: document.getElementById('projectName').value.trim(),
            color: document.getElementById('projectColor').value,
            description: document.getElementById('projectDescription').value.trim(),
            createdAt: new Date().toISOString()
        };

        if (!project.name) {
            this.showNotification('El nombre del proyecto es obligatorio', 'error');
            return;
        }

        this.projects.push(project);
        this.saveProjects();
        this.closeProjectModal();
        this.loadProjects();
        this.showNotification('Proyecto creado', 'success');
    }

    populateProjectSelect() {
        const select = document.getElementById('taskProject');
        select.innerHTML = '<option value="">Sin proyecto</option>';
        
        this.projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            select.appendChild(option);
        });
    }

    loadProjects() {
        const container = document.getElementById('projectsList');
        container.innerHTML = '';

        this.projects.forEach(project => {
            const projectDiv = document.createElement('div');
            projectDiv.className = 'project-item';
            projectDiv.innerHTML = `
                <div class="project-color" style="background-color: ${project.color}"></div>
                <span>${project.name}</span>
                <span class="count">${this.getProjectTaskCount(project.id)}</span>
            `;
            
            projectDiv.addEventListener('click', () => {
                this.currentFilter.project = project.id;
                this.renderTasks();
            });
            
            container.appendChild(projectDiv);
        });
    }

    getProjectTaskCount(projectId) {
        return this.tasks.filter(task => task.project === projectId && !task.completed).length;
    }

    // Tags Management
    loadTags() {
        const container = document.getElementById('tagsList');
        container.innerHTML = '';

        this.tags.forEach(tag => {
            const tagDiv = document.createElement('div');
            tagDiv.className = 'tag-item';
            tagDiv.innerHTML = `
                <i class="fas fa-tag"></i>
                <span>${tag}</span>
                <span class="count">${this.getTagTaskCount(tag)}</span>
            `;
            
            tagDiv.addEventListener('click', () => {
                this.currentFilter.tag = tag;
                this.renderTasks();
            });
            
            container.appendChild(tagDiv);
        });
    }

    getTagTaskCount(tag) {
        return this.tasks.filter(task => task.tags && task.tags.includes(tag) && !task.completed).length;
    }

    // View Management
    switchView(view) {
        this.currentView = view;
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        // Update view title
        const titles = {
            today: 'Hoy',
            upcoming: 'Próximas',
            all: 'Todas las Tareas',
            completed: 'Completadas'
        };
        document.getElementById('viewTitle').textContent = titles[view];
        
        this.renderTasks();
    }

    // Task Rendering
    renderTasks() {
        const container = document.getElementById('tasksContainer');
        const emptyState = document.getElementById('emptyState');
        
        let filteredTasks = this.getFilteredTasks();
        
        if (filteredTasks.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }
        
        container.style.display = 'block';
        emptyState.style.display = 'none';
        
        // Sort tasks
        filteredTasks = this.sortTasks(filteredTasks);
        
        container.innerHTML = '';
        
        filteredTasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            container.appendChild(taskElement);
        });
    }

    getFilteredTasks() {
        let filtered = [...this.tasks];
        
        // Filter by view
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        
        switch (this.currentView) {
            case 'today':
                filtered = filtered.filter(task => 
                    !task.completed && 
                    (task.dueDate === today || !task.dueDate)
                );
                break;
            case 'upcoming':
                filtered = filtered.filter(task => 
                    !task.completed && 
                    task.dueDate && 
                    task.dueDate >= tomorrow
                );
                break;
            case 'completed':
                filtered = filtered.filter(task => task.completed);
                break;
            case 'all':
                filtered = filtered.filter(task => !task.completed);
                break;
        }
        
        // Filter by priority
        if (this.currentFilter.priority !== 'all') {
            filtered = filtered.filter(task => task.priority === this.currentFilter.priority);
        }
        
        // Filter by project
        if (this.currentFilter.project !== 'all') {
            filtered = filtered.filter(task => task.project === this.currentFilter.project);
        }
        
        // Filter by tag
        if (this.currentFilter.tag !== 'all') {
            filtered = filtered.filter(task => task.tags && task.tags.includes(this.currentFilter.tag));
        }
        
        // Filter by search
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(task => 
                task.title.toLowerCase().includes(query) ||
                (task.description && task.description.toLowerCase().includes(query)) ||
                (task.tags && task.tags.some(tag => tag.toLowerCase().includes(query)))
            );
        }
        
        return filtered;
    }

    sortTasks(tasks) {
        return tasks.sort((a, b) => {
            switch (this.currentSort) {
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case 'created':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'alphabetical':
                    return a.title.localeCompare(b.title);
                case 'dueDate':
                default:
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
            }
        });
    }

    createTaskElement(task) {
        const taskDiv = document.createElement('div');
        taskDiv.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        const project = this.projects.find(p => p.id === task.project);
        const dueDateClass = this.getDueDateClass(task.dueDate);
        
        taskDiv.innerHTML = `
            <div class="task-header-content">
                <div>
                    <div class="task-title">${task.title}</div>
                    ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                </div>
                <div class="task-actions-buttons">
                    <button class="btn-icon" onclick="app.toggleTaskComplete('${task.id}')" title="${task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}">
                        <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                    </button>
                    <button class="btn-icon" onclick="app.openTaskModal(app.tasks.find(t => t.id === '${task.id}'))" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="app.deleteTask('${task.id}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            
            <div class="task-meta">
                <div class="task-meta-left">
                    <span class="task-priority ${task.priority}">
                        <i class="fas fa-flag"></i>
                        ${task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                    
                    ${task.dueDate ? `
                        <span class="task-due-date ${dueDateClass}">
                            <i class="fas fa-calendar"></i>
                            ${this.formatDate(task.dueDate)}
                            ${task.dueTime ? ` ${task.dueTime}` : ''}
                        </span>
                    ` : ''}
                    
                    ${project ? `
                        <span class="task-project" style="border-left: 3px solid ${project.color}">
                            <i class="fas fa-folder"></i>
                            ${project.name}
                        </span>
                    ` : ''}
                </div>
                
                <div class="task-tags">
                    ${task.tags ? task.tags.map(tag => `<span class="task-tag">${tag}</span>`).join('') : ''}
                </div>
            </div>
            
            ${task.subtasks && task.subtasks.length > 0 ? `
                <div class="task-subtasks">
                    ${task.subtasks.map(subtask => `
                        <div class="subtask ${subtask.completed ? 'completed' : ''}">
                            <i class="fas ${subtask.completed ? 'fa-check-square' : 'fa-square'}"></i>
                            ${subtask.title}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        `;
        
        return taskDiv;
    }

    getDueDateClass(dueDate) {
        if (!dueDate) return '';
        
        const today = new Date().toISOString().split('T')[0];
        const due = new Date(dueDate).toISOString().split('T')[0];
        
        if (due < today) return 'overdue';
        if (due === today) return 'today';
        return '';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Hoy';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Mañana';
        } else {
            return date.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short'
            });
        }
    }

    // Search and Filters
    toggleSearch() {
        const searchBar = document.getElementById('searchBar');
        const searchInput = document.getElementById('searchInput');
        
        if (searchBar.style.display === 'none' || !searchBar.style.display) {
            searchBar.style.display = 'flex';
            searchInput.focus();
        } else {
            this.closeSearch();
        }
    }

    closeSearch() {
        document.getElementById('searchBar').style.display = 'none';
        document.getElementById('searchInput').value = '';
        this.searchQuery = '';
        this.renderTasks();
    }

    handleSearch(e) {
        this.searchQuery = e.target.value;
        this.renderTasks();
    }

    handleSort(e) {
        this.currentSort = e.target.value;
        this.renderTasks();
    }

    handleFilter(e) {
        this.currentFilter.priority = e.target.value;
        this.renderTasks();
    }

    // Counts and Statistics
    updateCounts() {
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        
        const todayCount = this.tasks.filter(task => 
            !task.completed && (task.dueDate === today || !task.dueDate)
        ).length;
        
        const upcomingCount = this.tasks.filter(task => 
            !task.completed && task.dueDate && task.dueDate >= tomorrow
        ).length;
        
        const allCount = this.tasks.filter(task => !task.completed).length;
        const completedCount = this.tasks.filter(task => task.completed).length;
        
        document.getElementById('todayCount').textContent = todayCount;
        document.getElementById('upcomingCount').textContent = upcomingCount;
        document.getElementById('allCount').textContent = allCount;
        document.getElementById('completedCount').textContent = completedCount;
    }

    // Notifications and Reminders
    setupNotifications() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div>${message}</div>
            <button class="btn-icon-small" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    checkReminders() {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const currentTime = now.toTimeString().slice(0, 5);
        
        this.tasks.forEach(task => {
            if (!task.completed && task.dueDate === today && task.dueTime) {
                const taskTime = task.dueTime;
                const timeDiff = this.getTimeDifference(currentTime, taskTime);
                
                // Remind 15 minutes before
                if (timeDiff === 15) {
                    this.sendReminder(task, '15 minutos');
                }
                // Remind when due
                else if (timeDiff === 0) {
                    this.sendReminder(task, 'ahora');
                }
            }
        });
    }

    getTimeDifference(current, target) {
        const currentMinutes = this.timeToMinutes(current);
        const targetMinutes = this.timeToMinutes(target);
        return targetMinutes - currentMinutes;
    }

    timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    sendReminder(task, timeText) {
        const message = `Recordatorio: ${task.title} - Vence ${timeText}`;
        
        // Browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('TaskPlanner Pro', {
                body: message,
                icon: '/favicon.ico'
            });
        }
        
        // In-app notification
        this.showNotification(message, 'warning');
    }

    // Data Persistence
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    saveProjects() {
        localStorage.setItem('projects', JSON.stringify(this.projects));
    }

    saveTags() {
        localStorage.setItem('tags', JSON.stringify(this.tags));
    }

    // Data Export/Import
    exportData() {
        const data = {
            tasks: this.tasks,
            projects: this.projects,
            tags: this.tags,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `taskplanner-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Datos exportados correctamente', 'success');
    }

    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.tasks) this.tasks = data.tasks;
                if (data.projects) this.projects = data.projects;
                if (data.tags) this.tags = data.tags;
                
                this.saveTasks();
                this.saveProjects();
                this.saveTags();
                
                this.loadProjects();
                this.loadTags();
                this.renderTasks();
                this.updateCounts();
                
                this.showNotification('Datos importados correctamente', 'success');
            } catch (error) {
                this.showNotification('Error al importar datos', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the application
const app = new TaskPlannerApp();

// Global functions for inline event handlers
window.openTaskModal = () => app.openTaskModal();
window.app = app;
