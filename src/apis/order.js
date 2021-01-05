import http from '../libs/http';

export default {
    list: (data) => http.post('api/order/list', data),
    statistic: () => http.post('api/order/statistics'),
    create: (data) => http.post('api/order/add', data),
    update: (data) => http.post('api/order/update', data),
    allot: (data) => http.post('api/order/edit_name', data),
    status: (data) => http.post('api/order/status', data),
}