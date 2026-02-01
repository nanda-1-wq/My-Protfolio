// ==================== STATE MANAGEMENT ====================
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let currentPriorityFilter = ['high', 'medium', 'low'];
let searchTerm = '';
let currentEditingTaskId = null;
let timerInterval = null;
let timerSeconds = 0;
let currentTaskForTimer = null;

const teamMembers = [
    { id: 1, name: 'John Doe', initials: 'JD' },
    { id: 2, name: 'Jane Smith', initials: 'JS' },
    { id: 3, name: 'Mike Johnson', initials: 'MJ' },
    { id: 4, name: 'Sarah Williams', initials: 'SW' },
    { id: 5, name: 'Alex Brown', initials: 'AB' }
];

const taskCategories = [
    { name: 'Work', color: '#164863' },
    { name: 'Personal', color: '#29d3c9' },
    { name: 'Shopping', color: '#f57c00' },
    { name: 'Health', color: '#388e3c' },
    { name: 'Learning', color: '#7b1fa2' }
];

// ==================== DOM ELEMENTS ====================
const taskModal = document.getElementById('taskModal');
const taskDetailsModal = document.getElementById('taskDetailsModal');
const timeTrackerModal = document.getElementById('timeTrackerModal');
const statsModal = document.getElementById('statsModal');
const confirmModal = document.getElementById('confirmModal');
const taskForm = document.getElementById('taskForm');
const tasksContainer = document.getElementById('tasksContainer');
const newTaskBtn = document.getElementById('newTaskBtn');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const navItems = document.querySelectorAll('.nav-item');
const priorityCheckboxes = document.querySelectorAll('.priority-checkbox');
const themeToggle = document.getElementById('themeToggle');
const statsBtn = document.getElementById('statsBtn');
const toast = document.getElementById('toast');

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateDateDisplay();
    renderTasks();
    updateStats();
    populateCategories();
    setupAssigneeInput();
    setupTagsInput();
});

setInterval(updateDateDisplay, 60000);

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Modal triggers
    newTaskBtn.addEventListener('click', openTaskModal);
    document.getElementById('emptyNewTaskBtn').addEventListener('click', openTaskModal);
    document.getElementById('closeTaskModal').addEventListener('click', closeTaskModal);
    document.getElementById('closeDetailsModal').addEventListener('click', closeDetailsModal);
    document.getElementById('closeTimeTracker').addEventListener('click', closeTimeTracker);
    document.getElementById('closeStats').addEventListener('click', closeStatsModal);
    document.getElementById('cancelBtn').addEventListener('click', closeTaskModal);

    // Form submission
    taskForm.addEventListener('submit', handleTaskSubmit);

    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            currentFilter = item.dataset.filter;
            renderTasks();
        });
    });

    // Filters
    priorityCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updatePriorityFilter);
    });

    // Search and Sort
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value.toLowerCase();
        renderTasks();
    });

    sortSelect.addEventListener('change', renderTasks);

    // Theme Toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Stats
    statsBtn.addEventListener('click', openStatsModal);

    // Confirmation modal
    document.getElementById('confirmCancel').addEventListener('click', closeConfirmModal);
    document.getElementById('confirmOk').addEventListener('click', () => {
        if (window.pendingDelete) {
            deleteTask(window.pendingDelete);
            closeConfirmModal();
        }
    });

    // Timer buttons
    document.getElementById('startBtn').addEventListener('click', startTimer);
    document.getElementById('pauseBtn').addEventListener('click', pauseTimer);
    document.getElementById('resetBtn').addEventListener('click', resetTimer);
    document.getElementById('saveTimeBtn').addEventListener('click', saveTime);

    // Close modals on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeTaskModal();
            closeDetailsModal();
            closeTimeTracker();
            closeConfirmModal();
        }
    });
}

// ==================== DATE DISPLAY ====================
function updateDateDisplay() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date().toLocaleDateString('en-US', options);
    document.getElementById('dateDisplay').textContent = date;
}

// ==================== TASK MANAGEMENT ====================
function openTaskModal(taskId = null) {
    currentEditingTaskId = taskId;
    document.getElementById('modalTitle').textContent = taskId ? 'Edit Task' : 'New Task';

    if (taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description;
            document.getElementById('taskCategory').value = task.category;
            document.getElementById('taskPriority').value = task.priority;
            document.getElementById('taskDueDate').value = task.dueDate;
            document.getElementById('taskEstimatedTime').value = task.estimatedTime;
            
            // Populate assigned members
            const assignedMembersDiv = document.getElementById('assignedMembers');
            if (assignedMembersDiv && task.assignees) {
                assignedMembersDiv.innerHTML = task.assignees
                    .map(id => {
                        const member = teamMembers.find(m => m.id === id);
                        return member ? `
                            <div class="member-tag">
                                ${member.name}
                                <button type="button" onclick="removeMember(${id})">×</button>
                            </div>
                        ` : '';
                    })
                    .join('');
            }
            
            // Populate tags
            const tagsListDiv = document.getElementById('tagsList');
            if (tagsListDiv && task.tags) {
                tagsListDiv.innerHTML = task.tags
                    .map(tag => `
                        <div class="task-tag">
                            ${tag}
                            <button type="button" onclick="removeTag('${tag}')">×</button>
                        </div>
                    `)
                    .join('');
            }
        }
    } else {
        // Reset form for new task
        taskForm.reset();
        const assignedMembersDiv = document.getElementById('assignedMembers');
        const tagsListDiv = document.getElementById('tagsList');
        
        if (assignedMembersDiv) assignedMembersDiv.innerHTML = '';
        if (tagsListDiv) tagsListDiv.innerHTML = '';
    }

    taskModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeTaskModal() {
    taskModal.classList.remove('active');
    currentEditingTaskId = null;
    document.body.style.overflow = 'auto';
}

function handleTaskSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const category = document.getElementById('taskCategory').value;
    const priority = document.getElementById('taskPriority').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const estimatedTime = parseFloat(document.getElementById('taskEstimatedTime').value) || 0;

    // Get assignees
    const assignees = Array.from(document.getElementById('assignedMembers').querySelectorAll('.member-tag'))
        .map(tag => {
            const name = tag.textContent.trim().replace('×', '').trim();
            const member = teamMembers.find(m => m.name === name);
            return member ? member.id : null;
        })
        .filter(id => id !== null);

    // Get tags
    const tags = Array.from(document.getElementById('tagsList').querySelectorAll('.task-tag'))
        .map(tag => tag.textContent.trim().replace('×', '').trim());

    if (currentEditingTaskId) {
        // Edit existing task
        const task = tasks.find(t => t.id === currentEditingTaskId);
        task.title = title;
        task.description = description;
        task.category = category;
        task.priority = priority;
        task.dueDate = dueDate;
        task.estimatedTime = estimatedTime;
        task.assignees = assignees;
        task.tags = tags;
        showNotification('Task updated successfully!', 'success');
    } else {
        // Create new task
        const newTask = {
            id: Date.now(),
            title,
            description,
            category,
            priority,
            dueDate,
            estimatedTime,
            assignees,
            tags,
            completed: false,
            createdAt: new Date().toISOString(),
            timeLogs: []
        };
        tasks.push(newTask);
        showNotification('Task created successfully!', 'success');
    }

    saveTasks();
    renderTasks();
    updateStats();
    closeTaskModal();
}

function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks();
    renderTasks();
    updateStats();
    showNotification('Task deleted', 'success');
}

function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
    updateStats();
    showNotification(task.completed ? 'Task completed!' : 'Task marked as incomplete', 'success');
}

// ==================== TASK RENDERING ====================
function renderTasks() {
    let filteredTasks = filterAndSortTasks();

    if (filteredTasks.length === 0) {
        tasksContainer.style.display = 'none';
        document.getElementById('emptyState').style.display = 'flex';
        return;
    }

    tasksContainer.style.display = 'grid';
    document.getElementById('emptyState').style.display = 'none';

    tasksContainer.innerHTML = filteredTasks.map(task => `
        <div class="task-card ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
            <div class="task-header">
                <div class="task-title-section">
                    <div class="checkbox-wrapper">
                        <input type="checkbox" ${task.completed ? 'checked' : ''} 
                               onchange="toggleTaskCompletion(${task.id})">
                    </div>
                    <div class="task-info" onclick="openTaskDetails(${task.id})">
                        <h3 class="task-title">${escapeHtml(task.title)}</h3>
                        ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
                        
                        <div class="task-meta">
                            <span class="priority-badge ${task.priority}">
                                <span class="priority-dot ${task.priority}"></span>
                                ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </span>
                            ${task.category ? `<span class="task-badge">${escapeHtml(task.category)}</span>` : ''}
                            ${task.dueDate ? `
                                <span class="task-badge task-due ${getDueDateClass(task.dueDate)}">
                                    <i class='bx bx-calendar'></i>
                                    ${formatDate(task.dueDate)}
                                </span>
                            ` : ''}
                            ${task.timeLogs.length > 0 ? `
                                <span class="task-time">
                                    <i class='bx bx-time-five'></i>
                                    ${calculateTotalTime(task.timeLogs)}h
                                </span>
                            ` : ''}
                            ${task.assignees.length > 0 ? `
                                <div class="assignees">
                                    ${task.assignees.slice(0, 3).map(id => {
                                        const member = teamMembers.find(m => m.id === id);
                                        return `<div class="assignee-avatar" title="${member.name}">${member.initials}</div>`;
                                    }).join('')}
                                    ${task.assignees.length > 3 ? `<span>+${task.assignees.length - 3}</span>` : ''}
                                </div>
                            ` : ''}
                        </div>
                        ${task.tags.length > 0 ? `
                            <div class="task-tags">
                                ${task.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="action-btn" onclick="openTimeTracker(${task.id})" title="Time Tracker">
                        <i class='bx bx-time-five'></i>
                    </button>
                    <button class="action-btn" onclick="openTaskModal(${task.id})" title="Edit">
                        <i class='bx bx-edit'></i>
                    </button>
                    <button class="action-btn delete" onclick="confirmDelete(${task.id})" title="Delete">
                        <i class='bx bx-trash'></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterAndSortTasks() {
    let filtered = tasks.filter(task => {
        // Filter by current view
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const taskDate = task.dueDate ? new Date(task.dueDate) : null;

        let viewMatch = true;
        if (currentFilter === 'today') {
            viewMatch = taskDate && taskDate.getTime() === today.getTime() && !task.completed;
        } else if (currentFilter === 'upcoming') {
            viewMatch = taskDate && taskDate > today && !task.completed;
        } else if (currentFilter === 'completed') {
            viewMatch = task.completed;
        } else if (currentFilter === 'overdue') {
            viewMatch = taskDate && taskDate < today && !task.completed;
        }

        // Filter by priority
        const priorityMatch = currentPriorityFilter.includes(task.priority);

        // Filter by search
        const searchMatch = task.title.toLowerCase().includes(searchTerm) ||
                          task.description.toLowerCase().includes(searchTerm) ||
                          task.category.toLowerCase().includes(searchTerm);

        return viewMatch && priorityMatch && searchMatch;
    });

    // Sort
    const sortBy = sortSelect.value;
    filtered.sort((a, b) => {
        switch(sortBy) {
            case 'priority':
                const priorityOrder = { high: 1, medium: 2, low: 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            case 'name':
                return a.title.localeCompare(b.title);
            case 'time':
                return calculateTotalTime(b.timeLogs) - calculateTotalTime(a.timeLogs);
            case 'date':
            default:
                return new Date(a.dueDate) - new Date(b.dueDate);
        }
    });

    return filtered;
}

// ==================== TASK DETAILS ====================
function openTaskDetails(taskId) {
    const task = tasks.find(t => t.id === taskId);
    const totalTime = calculateTotalTime(task.timeLogs);

    const content = document.getElementById('taskDetailsContent');
    content.innerHTML = `
        <div class="task-detail-header">
            <div>
                <h2 class="task-detail-title">${escapeHtml(task.title)}</h2>
                <div class="task-detail-grid" style="margin-top: 1rem; gap: 0.5rem;">
                    <span class="priority-badge ${task.priority}">
                        <span class="priority-dot ${task.priority}"></span>
                        ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                    </span>
                    ${task.category ? `<span class="task-badge">${escapeHtml(task.category)}</span>` : ''}
                </div>
            </div>
            <div class="task-detail-actions">
                <button onclick="openTimeTracker(${task.id})" title="Track Time">
                    <i class='bx bx-time-five'></i>
                </button>
                <button onclick="toggleTaskCompletion(${task.id}); closeDetailsModal();" title="Complete Task">
                    <i class='bx bx-check'></i>
                </button>
                <button onclick="openTaskModal(${task.id}); closeDetailsModal();" title="Edit">
                    <i class='bx bx-edit'></i>
                </button>
            </div>
        </div>

        <div class="task-detail-grid">
            <div class="detail-section">
                <div class="detail-field">
                    <label class="detail-label">Description</label>
                    <div class="detail-value">${task.description || 'No description'}</div>
                </div>

                <div class="detail-field">
                    <label class="detail-label">Due Date</label>
                    <div class="detail-value">${task.dueDate ? formatDate(task.dueDate) : 'No due date'}</div>
                </div>

                <div class="detail-field">
                    <label class="detail-label">Estimated Time</label>
                    <div class="detail-value">${task.estimatedTime || 0} hours</div>
                </div>
            </div>

            <div class="detail-section">
                <div class="detail-field">
                    <label class="detail-label">Time Tracked</label>
                    <div class="detail-value">${totalTime}h / ${task.estimatedTime || 0}h</div>
                </div>

                <div class="detail-field">
                    <label class="detail-label">Assigned To</label>
                    <div class="detail-badges">
                        ${task.assignees.length > 0 
                            ? task.assignees.map(id => {
                                const member = teamMembers.find(m => m.id === id);
                                return `<span class="task-badge">${member.name}</span>`;
                            }).join('')
                            : '<div class="detail-value">Unassigned</div>'
                        }
                    </div>
                </div>

                ${task.tags.length > 0 ? `
                    <div class="detail-field">
                        <label class="detail-label">Tags</label>
                        <div class="detail-badges">
                            ${task.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>

        ${task.timeLogs.length > 0 ? `
            <div style="margin-top: 2rem; border-top: 1px solid var(--border-color); padding-top: 2rem;">
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Time Logs</h3>
                <div class="time-logs">
                    ${task.timeLogs.map((log, index) => `
                        <div class="time-log">
                            <div>
                                <strong>${log.date}</strong>
                            </div>
                            <div class="time-log-duration">${log.duration}h</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
    `;

    taskDetailsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDetailsModal() {
    taskDetailsModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ==================== TIME TRACKER ====================
function openTimeTracker(taskId) {
    currentTaskForTimer = taskId;
    timerSeconds = 0;
    resetTimerDisplay();

    const task = tasks.find(t => t.id === taskId);
    document.querySelector('.time-tracker-modal .modal-header h2').textContent = `Time Tracker: ${task.title}`;

    const timeLogs = document.getElementById('timeLogs');
    if (task.timeLogs.length > 0) {
        timeLogs.innerHTML = '<h4 style="margin-bottom: 1rem;">Previous Logs</h4>' + task.timeLogs
            .map(log => `
                <div class="time-log">
                    <div>${log.date}</div>
                    <div class="time-log-duration">${log.duration}h</div>
                </div>
            `)
            .join('');
    } else {
        timeLogs.innerHTML = '';
    }

    closeDetailsModal();
    timeTrackerModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeTimeTracker() {
    pauseTimer();
    timeTrackerModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function startTimer() {
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('pauseBtn').style.display = 'flex';

    timerInterval = setInterval(() => {
        timerSeconds++;
        updateTimerDisplay();
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    document.getElementById('startBtn').style.display = 'flex';
    document.getElementById('pauseBtn').style.display = 'none';
}

function resetTimer() {
    pauseTimer();
    timerSeconds = 0;
    resetTimerDisplay();
}

function updateTimerDisplay() {
    const hours = Math.floor(timerSeconds / 3600);
    const minutes = Math.floor((timerSeconds % 3600) / 60);
    const seconds = timerSeconds % 60;

    document.getElementById('timerTime').textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function resetTimerDisplay() {
    document.getElementById('timerTime').textContent = '00:00:00';
}

function saveTime() {
    if (timerSeconds === 0) {
        showNotification('No time to save', 'error');
        return;
    }

    const hours = (timerSeconds / 3600).toFixed(2);
    const task = tasks.find(t => t.id === currentTaskForTimer);

    if (!task.timeLogs) task.timeLogs = [];

    task.timeLogs.push({
        date: new Date().toLocaleDateString(),
        duration: parseFloat(hours)
    });

    saveTasks();
    renderTasks();
    updateStats();
    closeTimeTracker();
    showNotification(`${hours}h logged successfully!`, 'success');
}

// ==================== STATISTICS ====================
function openStatsModal() {
    const stats = calculateStatistics();

    document.getElementById('statTotalTasks').textContent = stats.total;
    document.getElementById('statCompletedTasks').textContent = stats.completed;
    document.getElementById('statTotalHours').textContent = `${stats.totalHours}h`;
    document.getElementById('statCompletionRate').textContent = stats.completionRate + '%';

    // Priority chart
    const priorityChart = document.getElementById('priorityChart');
    priorityChart.innerHTML = ['high', 'medium', 'low'].map(priority => {
        const count = tasks.filter(t => t.priority === priority).length;
        const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
        return `
            <div class="chart-item">
                <span class="chart-label">${priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
                <div class="chart-bar">
                    <div class="chart-progress" style="width: ${percentage}%">${count}</div>
                </div>
            </div>
        `;
    }).join('');

    // Category chart
    const categoryChart = document.getElementById('categoryChart');
    const categories = [...new Set(tasks.map(t => t.category).filter(c => c))];
    categoryChart.innerHTML = categories.map(category => {
        const count = tasks.filter(t => t.category === category).length;
        const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
        return `
            <div class="chart-item">
                <span class="chart-label">${category}</span>
                <div class="chart-bar">
                    <div class="chart-progress" style="width: ${percentage}%">${count}</div>
                </div>
            </div>
        `;
    }).join('');

    statsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeStatsModal() {
    statsModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function calculateStatistics() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const totalHours = tasks.reduce((sum, task) => sum + calculateTotalTime(task.timeLogs), 0);
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, totalHours, completionRate };
}

function updateStats() {
    const stats = calculateStatistics();
    
    document.getElementById('totalTasks').textContent = stats.total;
    document.getElementById('totalHours').textContent = `${stats.totalHours}h`;
    
    // Update badges
    updateTaskCountBadges();
}

function updateTaskCountBadges() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const allCount = tasks.length;
    const todayCount = tasks.filter(t => {
        const taskDate = t.dueDate ? new Date(t.dueDate) : null;
        return taskDate && taskDate.getTime() === today.getTime() && !t.completed;
    }).length;

    const upcomingCount = tasks.filter(t => {
        const taskDate = t.dueDate ? new Date(t.dueDate) : null;
        return taskDate && taskDate > today && !t.completed;
    }).length;

    const completedCount = tasks.filter(t => t.completed).length;
    const overdueCount = tasks.filter(t => {
        const taskDate = t.dueDate ? new Date(t.dueDate) : null;
        return taskDate && taskDate < today && !t.completed;
    }).length;

    document.getElementById('allTasksBadge').textContent = allCount;
    document.getElementById('todayBadge').textContent = todayCount;
    document.getElementById('upcomingBadge').textContent = upcomingCount;
    document.getElementById('completedBadge').textContent = completedCount;
    document.getElementById('overdueBadge').textContent = overdueCount;
}

// ==================== FILTERING ====================
function updatePriorityFilter() {
    currentPriorityFilter = Array.from(priorityCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    renderTasks();
}

// ==================== ASSIGNEES ====================
function setupAssigneeInput() {
    const assigneeInput = document.getElementById('assigneeInput');
    const assigneeSuggestions = document.getElementById('assigneeSuggestions');

    if (assigneeInput) {
        assigneeInput.addEventListener('input', (e) => {
            const value = e.target.value.toLowerCase();

            if (value.length === 0) {
                assigneeSuggestions.style.display = 'none';
                return;
            }

            const filtered = teamMembers.filter(member =>
                member.name.toLowerCase().includes(value)
            );

            if (filtered.length === 0) {
                assigneeSuggestions.style.display = 'none';
                return;
            }

            assigneeSuggestions.innerHTML = filtered.map(member => `
                <div class="suggestion-item" onclick="addMember(${member.id}, '${member.name}')">
                    ${member.name}
                </div>
            `).join('');
            assigneeSuggestions.style.display = 'block';
        });
    }
}

function addMember(memberId, memberName) {
    const assignedMembers = document.getElementById('assignedMembers');
    
    // Check if already added
    if (Array.from(assignedMembers.querySelectorAll('.member-tag')).some(tag => tag.textContent.includes(memberName))) {
        return;
    }

    const memberTag = document.createElement('div');
    memberTag.className = 'member-tag';
    memberTag.innerHTML = `
        ${memberName}
        <button type="button" onclick="removeMember(${memberId})">×</button>
    `;
    assignedMembers.appendChild(memberTag);

    document.getElementById('assigneeInput').value = '';
    document.getElementById('assigneeSuggestions').style.display = 'none';
}

function removeMember(memberId) {
    const member = teamMembers.find(m => m.id === memberId);
    const assignedMembers = document.getElementById('assignedMembers');
    
    Array.from(assignedMembers.querySelectorAll('.member-tag')).forEach(tag => {
        if (tag.textContent.includes(member.name)) {
            tag.remove();
        }
    });
}

// ==================== TAGS ====================
function setupTagsInput() {
    const tagsInput = document.getElementById('tagsInput');

    if (tagsInput) {
        tagsInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const tag = tagsInput.value.trim();

                if (tag && tag.length > 0) {
                    const tagsList = document.getElementById('tagsList');
                    const tagElement = document.createElement('div');
                    tagElement.className = 'task-tag';
                    tagElement.innerHTML = `
                        ${escapeHtml(tag)}
                        <button type="button" onclick="removeTag('${tag}')">×</button>
                    `;
                    tagsList.appendChild(tagElement);
                    tagsInput.value = '';
                }
            }
        });
    }
}

function removeTag(tag) {
    const tagsList = document.getElementById('tagsList');
    Array.from(tagsList.querySelectorAll('.task-tag')).forEach(element => {
        if (element.textContent.includes(tag)) {
            element.remove();
        }
    });
}

// ==================== CATEGORIES ====================
function populateCategories() {
    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = taskCategories.map((category, index) => `
        <label class="checkbox-label">
            <input type="checkbox" value="${category.name}" class="category-checkbox" checked>
            <span class="category-color" style="background: ${category.color};"></span>
            <span>${category.name}</span>
        </label>
    `).join('');

    document.querySelectorAll('.category-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', renderTasks);
    });
}

// ==================== UTILITIES ====================
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getDueDateClass(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date < today) return 'overdue';
    if (date.getTime() === today.getTime()) return 'today';
    return 'upcoming';
}

function calculateTotalTime(timeLogs) {
    return timeLogs.reduce((sum, log) => sum + log.duration, 0).toFixed(1);
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function confirmDelete(taskId) {
    window.pendingDelete = taskId;
    document.getElementById('confirmTitle').textContent = 'Delete Task?';
    document.getElementById('confirmMessage').textContent = 'This action cannot be undone.';
    confirmModal.classList.add('active');
}

function closeConfirmModal() {
    confirmModal.classList.remove('active');
    window.pendingDelete = null;
}

function showNotification(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Load theme preference
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}