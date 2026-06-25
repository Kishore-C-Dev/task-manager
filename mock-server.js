const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const DELAY = 300;
function sendDelayed(res, data, status = 200) {
  setTimeout(() => res.status(status).json(data), DELAY);
}

// --- Data stores ---

const optionsData = {
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

const pageConfigData = {
  requests: require('./src/config/requestPageConfig.json'),
  tasks: require('./src/config/taskPageConfig.json'),
};

const formConfigData = {
  requests: require('./src/config/requestFormConfig.json'),
  tasks: require('./src/config/taskFormConfig.json'),
};

const filterConfigData = {
  requests: require('./src/config/requestFilterConfig.json'),
  tasks: require('./src/config/taskFilterConfig.json'),
};

const dataStores = {
  requests: [
    { id: 'REQ-001', title: 'Update user authentication', status: 'open', priority: 'high', createdDate: '2026-06-20', assignee: 'alice', email: 'alice@example.com', phone: '(555) 111-2222', description: 'Upgrade auth module to support MFA' },
    { id: 'REQ-002', title: 'Database migration plan', status: 'in_progress', priority: 'critical', createdDate: '2026-06-18', assignee: 'bob', email: 'bob@example.com', phone: '', description: 'Plan migration from MySQL to PostgreSQL' },
    { id: 'REQ-003', title: 'API rate limiting', status: 'pending_review', priority: 'medium', createdDate: '2026-06-15', assignee: 'carol', email: 'carol@example.com', phone: '(555) 333-4444', description: 'Implement rate limiting on public endpoints' },
    { id: 'REQ-004', title: 'Dashboard redesign', status: 'approved', priority: 'low', createdDate: '2026-06-10', assignee: 'david', email: 'david@example.com', phone: '', description: 'Redesign the analytics dashboard' },
    { id: 'REQ-005', title: 'Performance optimization', status: 'open', priority: 'high', createdDate: '2026-06-22', assignee: 'eva', email: 'eva@example.com', phone: '(555) 555-6666', description: 'Optimize slow database queries' },
  ],
  tasks: [
    { id: 'TSK-001', taskName: 'Write unit tests for auth', status: 'in_progress', priority: 'high', dueDate: '2026-06-28', assignee: 'alice', estimatedHours: 8, description: 'Cover all auth endpoints with unit tests' },
    { id: 'TSK-002', taskName: 'Set up CI pipeline', status: 'done', priority: 'medium', dueDate: '2026-06-25', assignee: 'bob', estimatedHours: 4, description: 'Configure GitHub Actions for CI' },
    { id: 'TSK-003', taskName: 'Review PR for rate limiter', status: 'todo', priority: 'medium', dueDate: '2026-06-30', assignee: 'carol', estimatedHours: 2, description: 'Code review for the rate limiter PR' },
    { id: 'TSK-004', taskName: 'Create wireframes', status: 'in_review', priority: 'low', dueDate: '2026-07-05', assignee: 'david', estimatedHours: 12, description: 'Wireframes for the new dashboard' },
    { id: 'TSK-005', taskName: 'Fix memory leak in worker', status: 'blocked', priority: 'critical', dueDate: '2026-06-26', assignee: 'eva', estimatedHours: 6, description: 'Investigate and fix the memory leak in background worker' },
  ],
};

let nextRequestId = 6;
let nextTaskId = 6;
function getNextId(entity) {
  if (entity === 'requests') return `REQ-${String(nextRequestId++).padStart(3, '0')}`;
  return `TSK-${String(nextTaskId++).padStart(3, '0')}`;
}

// --- Routes ---

app.get('/api/pageConfig/:entity', (req, res) => {
  const data = pageConfigData[req.params.entity];
  if (!data) return res.status(404).json({ error: 'Not found' });
  sendDelayed(res, data);
});

app.get('/api/formConfig/:entity', (req, res) => {
  const data = formConfigData[req.params.entity];
  if (!data) return res.status(404).json({ error: 'Not found' });
  sendDelayed(res, data);
});

app.get('/api/filterConfig/:entity', (req, res) => {
  const data = filterConfigData[req.params.entity];
  if (!data) return res.status(404).json({ error: 'Not found' });
  sendDelayed(res, data);
});

app.get('/api/options/:key', (req, res) => {
  sendDelayed(res, optionsData[req.params.key] || []);
});

app.get('/api/:entity(requests|tasks)', (req, res) => {
  const entity = req.params.entity;
  let data = [...(dataStores[entity] || [])];
  const { search, ...filters } = req.query;
  if (search) {
    const q = search.toLowerCase();
    data = data.filter(item =>
      Object.values(item).some(val => typeof val === 'string' && val.toLowerCase().includes(q))
    );
  }
  Object.entries(filters).forEach(([key, val]) => {
    if (val) {
      data = data.filter(item => String(item[key]) === String(val));
    }
  });
  sendDelayed(res, data);
});

app.get('/api/:entity(requests|tasks)/:id', (req, res) => {
  const store = dataStores[req.params.entity] || [];
  const item = store.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  sendDelayed(res, item);
});

app.post('/api/:entity(requests|tasks)', (req, res) => {
  const entity = req.params.entity;
  if (!dataStores[entity]) dataStores[entity] = [];
  const newItem = { ...req.body, id: getNextId(entity) };
  dataStores[entity].unshift(newItem);
  sendDelayed(res, newItem, 201);
});

app.put('/api/:entity(requests|tasks)/:id', (req, res) => {
  const store = dataStores[req.params.entity] || [];
  const index = store.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  store[index] = { ...store[index], ...req.body, id: req.params.id };
  sendDelayed(res, store[index]);
});

app.delete('/api/:entity(requests|tasks)/:id', (req, res) => {
  const store = dataStores[req.params.entity] || [];
  const index = store.findIndex(i => i.id === req.params.id);
  if (index !== -1) store.splice(index, 1);
  sendDelayed(res, { success: true });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
});
