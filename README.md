# Task Manager — JSON-Driven Dynamic Forms & Lists

A React + TypeScript application for managing requests and tasks. All forms, tables, filters, validations, labels, and layouts are driven entirely by JSON configuration — zero hardcoded UI text.

## Features

- **Dynamic Forms** — field types, labels, placeholders, validations, and section layouts (1/2/3 column) configured via JSON
- **Dynamic Tables** — columns, headers, sorting, pagination, and actions from API
- **Mobile Accordion View** — tables convert to expandable accordion cards on mobile viewports
- **Filter Widget** — configurable filter dropdowns and search per entity type (replaces search bar)
- **Conditional Fields** — fields show/hide based on other field values (e.g., approval section appears when priority is "high")
- **Multi-Select** — add multiple users as approvers with tag-based UI
- **Regex Validations** — email, phone, alphanumeric patterns defined in JSON
- **Cross-Field Validations** — conditional required rules at form submission
- **Responsive Layout** — sidebar collapses to horizontal nav; forms go single-column on mobile
- **Mock API Server** — Express server with realistic REST endpoints; all calls visible in browser Network/XHR tab

## Quick Start

```bash
# Install dependencies
npm install

# Start mock API server (port 3002)
node mock-server.js

# In a separate terminal, start React app (port 3001)
npm start
```

Open http://localhost:3001 in your browser.

## Project Structure

```
task-manager/
├── mock-server.js                      # Express mock API server
├── src/
│   ├── config/
│   │   ├── appConfig.json              # App title, navigation items, page keys
│   │   ├── requestFormConfig.json      # Request form: fields, validations, columns
│   │   ├── taskFormConfig.json         # Task form: fields, validations, columns
│   │   ├── requestFilterConfig.json    # Request list filter widgets
│   │   └── taskFilterConfig.json       # Task list filter widgets
│   ├── api/
│   │   └── mockApi.ts                  # Fetch wrappers for all API calls
│   ├── components/
│   │   ├── DynamicForm.tsx             # Renders form from JSON config
│   │   ├── DynamicField.tsx            # Renders individual field by type
│   │   ├── DynamicTable.tsx            # Table (desktop) + Accordion (mobile)
│   │   ├── FilterWidget.tsx            # Filter dropdowns/search from config
│   │   └── Layout.tsx                  # Sidebar nav from config
│   ├── pages/
│   │   ├── EntityListPage.tsx          # Generic list page (requests or tasks)
│   │   └── EntityFormPage.tsx          # Generic create/edit form page
│   ├── utils/
│   │   └── validator.ts               # Field + submit validation engine
│   ├── types/
│   │   └── index.ts                   # TypeScript interfaces
│   ├── App.tsx                         # Routes (dynamic from config)
│   └── App.css                         # Styles including responsive breakpoints
└── package.json
```

## API Endpoints (Mock Server)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pageConfig/:entity` | Page config (title, columns, sort, accordion) |
| GET | `/api/formConfig/:entity` | Form config (sections, fields, validations) |
| GET | `/api/filterConfig/:entity` | Filter widget config |
| GET | `/api/options/:key` | Dropdown options (statuses, priorities, users) |
| GET | `/api/:entity` | List items (supports query param filters) |
| GET | `/api/:entity/:id` | Get single item |
| POST | `/api/:entity` | Create item |
| PUT | `/api/:entity/:id` | Update item |
| DELETE | `/api/:entity/:id` | Delete item |

## JSON Configuration

### Form Section Columns

```json
{
  "title": "General Information",
  "columns": 2,
  "fields": [...]
}
```

Set `columns` to `1`, `2`, or `3`. On mobile all collapse to single column.

### Conditional Field Visibility

```json
{
  "name": "approvers",
  "type": "multiselect",
  "visibleWhen": { "field": "priority", "equals": "high" },
  "validations": {
    "required": { "value": true, "message": "At least one approver required" }
  }
}
```

### Filter Config

```json
{
  "filters": [
    { "name": "status", "label": "Status", "type": "select", "optionsEndpoint": "/api/options/statuses" },
    { "name": "search", "label": "Search", "type": "text", "placeholder": "Search..." }
  ],
  "applyButtonLabel": "Apply Filters",
  "resetButtonLabel": "Reset"
}
```

## Tech Stack

- React 18 + TypeScript
- React Router v7
- Express (mock API server)
- Plain CSS (no UI library)
