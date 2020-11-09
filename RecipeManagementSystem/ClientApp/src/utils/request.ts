const commonOptions: RequestInit = {
  cache: 'no-cache',
  headers: {
    'Content-Type': 'application/json',
  },
}

export function apiGet<T>(url: string): Promise<T> {
  return fetch(window.location.origin + '/' + url).then(response => {
    if (!response.ok) throw new Error(response.statusText);
    return response.json().then(data => data as T);
  });
}

export function apiPost<T>(url: string, dataToPost: T): Promise<T> {
  return fetch(window.location.origin + '/' + url, {
    ...commonOptions,
    method: 'POST',
    body: JSON.stringify(dataToPost),
    redirect: 'follow',
  }).then(response => {
    if (!response.ok) throw new Error(response.statusText);
    return response.json().then(data => data as T);
  });
}

export function apiPut<T>(url: string, dataToPut: T): Promise<void> {
  return fetch(window.location.origin + '/' + url, {
    ...commonOptions,
    method: 'PUT',
    body: JSON.stringify(dataToPut),
  }).then(response => {
    if (!response.ok) throw new Error(response.statusText);
    return Promise.resolve();
  });
}

export function apiDelete<T>(url: string): Promise<T> {
  return fetch(window.location.origin + '/' + url, {
    method: 'DELETE',
  }).then(response => {
    if (!response.ok) throw new Error(response.statusText);
    return response.json().then(data => data as T);
  });
}