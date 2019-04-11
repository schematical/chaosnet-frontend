const axios = require('axios');
class AuthService{
    static signup(username, password){
        return axios.post('/user?ID=12345')
    }
    static login(username, password){
        console.log(username, password);

       return axios.post('https://chaosnet.schematical.com/v0/auth/login', {
           username:username,
           password: password
       })

    }
}
export default AuthService;