import axios from 'axios';

export const instance = axios.create({
    baseURL: 'http://dev-queue.tsvs.kg/',
});
