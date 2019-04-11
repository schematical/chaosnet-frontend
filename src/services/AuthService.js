const axios = require('axios');
class AuthService{
    static signup(username, password){
        return axios.get('/user?ID=12345')
            .then(function (response) {
                // handle success
                console.log(response);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }
    static login(username, password){
       return axios.get('/user?ID=12345')

    }
}
export default AuthService;