const parseResponse = async (response) => {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || 'Something went wrong while processing your request';
    const error = new Error(message);
    error.status = response.status;
    error.errors = payload?.errors || null;
    throw error;
  }

  return payload;
};

export const apiService = {
  async get(endpoint) {
    const response = await fetch(endpoint);
    return parseResponse(response);
  },

  async post(endpoint, body) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return parseResponse(response);
  },

  async put(endpoint, body) {
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return parseResponse(response);
  },

  async delete(endpoint) {
    const response = await fetch(endpoint, {
      method: 'DELETE'
    });
    return parseResponse(response);
  }
};
