import http from './http-common';

class TutorialsService{
    getAll(){
        return http.get('/tutorial');
    }
    get(id){
        return http.get(`/tutorial/${id}`);
    }
    create(data){
        return http.post('/tutorial',data);
    }
    update(id, data){
        return http.put(`/tutorial/${id}`, data);
    }
    delete(id){
        return http.delete(`/tutorial/${id}`);
    }
    deleteAll(){
        return http.delete('/tutorial');
    }
    findByTitle(title){
        return http.get(`/tutorial?tittle=${title}`);
    }
}

export default new TutorialsService();