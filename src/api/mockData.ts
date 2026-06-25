import { EntityRecord } from '../types';

export const optionsData: Record<string, { label: string; value: string }[]> = {
  requestStatuses: [
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Pending Review', value: 'pending_review' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Closed', value: 'closed' },
  ],
  taskStatuses: [
    { label: 'To Do', value: 'todo' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'In Review', value: 'in_review' },
    { label: 'Done', value: 'done' },
    { label: 'Blocked', value: 'blocked' },
  ],
  priorities: [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Critical', value: 'critical' },
  ],
  users: [
    { label: 'Alice Johnson', value: 'alice' },
    { label: 'Bob Smith', value: 'bob' },
    { label: 'Carol Williams', value: 'carol' },
    { label: 'David Brown', value: 'david' },
    { label: 'Eva Martinez', value: 'eva' },
  ],
};

export const requestsData: EntityRecord[] = [
  { id: 'REQ-001', title: 'Update user authentication', status: 'open', priority: 'high', createdDate: '2026-06-20', assignee: 'alice', email: 'alice@example.com', phone: '(555) 111-2222', description: 'Upgrade auth module to support MFA' },
  { id: 'REQ-002', title: 'Database migration plan', status: 'in_progress', priority: 'critical', createdDate: '2026-06-18', assignee: 'bob', email: 'bob@example.com', phone: '', description: 'Plan migration from MySQL to PostgreSQL' },
  { id: 'REQ-003', title: 'API rate limiting', status: 'pending_review', priority: 'medium', createdDate: '2026-06-15', assignee: 'carol', email: 'carol@example.com', phone: '(555) 333-4444', description: 'Implement rate limiting on public endpoints' },
  { id: 'REQ-004', title: 'Dashboard redesign', status: 'approved', priority: 'low', createdDate: '2026-06-10', assignee: 'david', email: 'david@example.com', phone: '', description: 'Redesign the analytics dashboard' },
  { id: 'REQ-005', title: 'Performance optimization', status: 'open', priority: 'high', createdDate: '2026-06-22', assignee: 'eva', email: 'eva@example.com', phone: '(555) 555-6666', description: 'Optimize slow database queries' },
];

export const tasksData: EntityRecord[] = [
  { id: 'TSK-001', taskName: 'Write unit tests for auth', status: 'in_progress', priority: 'high', dueDate: '2026-06-28', assignee: 'alice', estimatedHours: 8, description: 'Cover all auth endpoints with unit tests' },
  { id: 'TSK-002', taskName: 'Set up CI pipeline', status: 'done', priority: 'medium', dueDate: '2026-06-25', assignee: 'bob', estimatedHours: 4, description: 'Configure GitHub Actions for CI' },
  { id: 'TSK-003', taskName: 'Review PR for rate limiter', status: 'todo', priority: 'medium', dueDate: '2026-06-30', assignee: 'carol', estimatedHours: 2, description: 'Code review for the rate limiter PR' },
  { id: 'TSK-004', taskName: 'Create wireframes', status: 'in_review', priority: 'low', dueDate: '2026-07-05', assignee: 'david', estimatedHours: 12, description: 'Wireframes for the new dashboard' },
  { id: 'TSK-005', taskName: 'Fix memory leak in worker', status: 'blocked', priority: 'critical', dueDate: '2026-06-26', assignee: 'eva', estimatedHours: 6, description: 'Investigate and fix the memory leak in background worker' },
];

export const pageConfigData: Record<string, any> = {
  requests: {
    title: 'Requests',
    createButtonLabel: 'New Request',
    searchPlaceholder: 'Search requests...',
    table: {
      columns: [
        { key: 'id', header: 'ID', width: '80px', sortable: true },
        { key: 'title', header: 'Title', sortable: true },
        { key: 'status', header: 'Status', sortable: true },
        { key: 'priority', header: 'Priority', sortable: true },
        { key: 'createdDate', header: 'Created', type: 'date', sortable: true },
        { key: 'assignee', header: 'Assignee', sortable: true },
      ],
      actions: [
        { key: 'edit', label: 'Edit' },
        { key: 'delete', label: 'Delete', confirm: 'Are you sure you want to delete this request?' },
      ],
      emptyMessage: 'No requests found.',
      pageSize: 10,
      defaultSortColumn: 'createdDate',
      defaultSortDirection: 'desc',
    },
    dataEndpoint: '/api/requests',
  },
  tasks: {
    title: 'Tasks',
    createButtonLabel: 'New Task',
    searchPlaceholder: 'Search tasks...',
    table: {
      columns: [
        { key: 'id', header: 'ID', width: '80px', sortable: true },
        { key: 'taskName', header: 'Task Name', sortable: true },
        { key: 'status', header: 'Status', sortable: true },
        { key: 'priority', header: 'Priority', sortable: true },
        { key: 'dueDate', header: 'Due Date', type: 'date', sortable: true },
        { key: 'assignee', header: 'Assignee', sortable: true },
      ],
      actions: [
        { key: 'edit', label: 'Edit' },
        { key: 'delete', label: 'Delete', confirm: 'Are you sure you want to delete this task?' },
      ],
      emptyMessage: 'No tasks found.',
      pageSize: 10,
      defaultSortColumn: 'dueDate',
      defaultSortDirection: 'asc',
    },
    dataEndpoint: '/api/tasks',
  },
};


let nextRequestId = 6;
let nextTaskId = 6;

export function getNextId(entity: string): string {
  if (entity === 'requests') {
    return `REQ-${String(nextRequestId++).padStart(3, '0')}`;
  }
  return `TSK-${String(nextTaskId++).padStart(3, '0')}`;
}
