import { EntityRecord } from '../types';

export async function fetchList(endpoint: string, filters?: Record<string, string>): Promise<EntityRecord[]> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
  }
  const qs = params.toString();
  const url = qs ? `${endpoint}?${qs}` : endpoint;
  const res = await fetch(url);
  return res.json();
}

export async function fetchOne(endpoint: string, id: string): Promise<EntityRecord | undefined> {
  const res = await fetch(`${endpoint}/${id}`);
  if (res.status === 404) return undefined;
  return res.json();
}

export async function createItem(endpoint: string, data: Record<string, any>): Promise<EntityRecord> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateItem(endpoint: string, id: string, data: Record<string, any>): Promise<EntityRecord> {
  const res = await fetch(`${endpoint}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteItem(endpoint: string, id: string): Promise<void> {
  await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
}

export async function fetchOptions(endpoint: string): Promise<{ label: string; value: string }[]> {
  const res = await fetch(endpoint);
  return res.json();
}

export async function fetchPageConfig(entityKey: string): Promise<any> {
  const res = await fetch(`/api/pageConfig/${entityKey}`);
  return res.json();
}

export async function fetchFormConfig(entityKey: string): Promise<any> {
  const res = await fetch(`/api/formConfig/${entityKey}`);
  return res.json();
}

export async function fetchFilterConfig(entityKey: string): Promise<any> {
  const res = await fetch(`/api/filterConfig/${entityKey}`);
  return res.json();
}

export async function fetchQuestionnaire(entityKey: string, priority: string): Promise<any> {
  const res = await fetch(`/api/questionnaire/${entityKey}/${priority}`);
  if (res.status === 404) return null;
  return res.json();
}
