const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
}

async function refreshToken() {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) throw new Error('No refresh token');

    const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refresh }),
    });

    if (!response.ok) throw new Error('Refresh failed');

    const { accessToken } = await response.json();
    localStorage.setItem('accessToken', accessToken);
    return accessToken;
}

async function apiFetch(endpoint: string, options: RequestOptions = {}): Promise<any> {
    const { params, ...init } = options;

    let url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    if (params) {
        const query = new URLSearchParams(params).toString();
        url += `?${query}`;
    }

    const isFormData = init.body instanceof FormData;
    const headers = new Headers(init.headers);
    if (!headers.has('Content-Type') && !isFormData) {
        headers.set('Content-Type', 'application/json');
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const config = { ...init, headers };

    try {
        let response = await fetch(url, config);

        if (response.status === 401) {
            try {
                const newToken = await refreshToken();
                headers.set('Authorization', `Bearer ${newToken}`);
                response = await fetch(url, { ...init, headers });
            } catch (err) {
                localStorage.clear();
                window.location.href = '/login';
                throw err;
            }
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw { response, data: errorData };
        }

        return {
            data: await response.json(),
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            config: config
        };

    } catch (error) {
        throw error;
    }
}

const api = {
    get: (url: string, options?: RequestOptions) => apiFetch(url, { ...options, method: 'GET' }),
    post: (url: string, body?: any, options?: RequestOptions) => {
        const isFormData = body instanceof FormData;
        return apiFetch(url, {
            ...options,
            method: 'POST',
            body: isFormData ? body : JSON.stringify(body)
        });
    },
    put: (url: string, body?: any, options?: RequestOptions) => {
        const isFormData = body instanceof FormData;
        return apiFetch(url, {
            ...options,
            method: 'PUT',
            body: isFormData ? body : JSON.stringify(body)
        });
    },
    delete: (url: string, options?: RequestOptions) => apiFetch(url, { ...options, method: 'DELETE' }),
    defaults: { baseURL: BASE_URL }
};

export default api;
