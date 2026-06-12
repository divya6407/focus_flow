const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const TASK_URL = `${BASE_URL}/task`;
const getToken = () => localStorage.getItem('ff_token');

const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
});

export const gettask = async () => {
    const res = await fetch(`${TASK_URL}`, { headers: authHeaders() });
    return res.json();
};

export const gettaskbyid = async (id) => {
    const res = await fetch(`${TASK_URL}/${id}`, { headers: authHeaders() });
    return res.json();
};

export const searchtask = async ({ priority, keyword }) => {
    const params = new URLSearchParams();
    if (priority) params.append("priority", priority);
    if (keyword) params.append("keyword", keyword);
    const res = await fetch(`${TASK_URL}/search?${params}`, { headers: authHeaders() });
    return res.json();
};

export const posttask = async (taskdata) => {
    const res = await fetch(`${TASK_URL}`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(taskdata),
    });
    return res.json();
};

export const updatetask = async (id, taskdata) => {
    const res = await fetch(`${TASK_URL}/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(taskdata),
    });
    return res.json();
};

export const deletetask = async (id) => {
    const res = await fetch(`${TASK_URL}/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return res.json();
};
