// import axios from 'axios';

// const api = axios.create({
//     baseURL: 'http://localhost:8080/api'
// });

// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token && token !== 'undefined' && token !== 'null') {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });


// export default api;


import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});

// Cet intercepteur s'exécute AVANT chaque requête
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Ajoute le header Authorization: Bearer <token>
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;