
const axios = require('axios');


class AuthService{
    static userData = null;
    static accessToken = null;
    static setUserData(userData){
        AuthService.userData = userData;
    }
    static whoami(accessToken){
        return axios.get(
            'https://chaosnet.schematical.com/v0/auth/whoami',
            {
                headers: {
                    "Authorization":accessToken
                }
            }
        );
    }
    static signup(data){
        return axios.post('https://chaosnet.schematical.com/v0/auth/signup', data)
    }
    static login(username, password){


       return axios.post('https://chaosnet.schematical.com/v0/auth/login', {
           username:username,
           password: password
       })
       .then((userData)=>{
           //console.log(userData);
           return userData;
       })

    }
    static async refreshAccessToken(username, refreshToken){


        let response = await axios.post('https://chaosnet.schematical.com/v0/auth/token', {
            refreshToken:refreshToken,
            username: username
        });
        this.setAccessToken(response.data.accessToken);
        return response;

    }
    static setAccessToken(accessToken){
        AuthService.accessToken = accessToken;
    }
    /*static checkVerificationToken(username, password){
        console.log(username, password);

        return axios.post('https://chaosnet.schematical.com/v0/auth/login', {
            username:username,
            password: password
        })

    }*/
}
export default AuthService;