
const axios = require('axios');


class AuthService{
    static userData = null;
    static accessToken = null;
    static cookies = null;
    static init(cookies){
        AuthService.cookies = cookies;
        let userDataString = AuthService.cookies.get('jwt');
        if(userDataString){
            AuthService.userData = userDataString;

            if(!AuthService.cookies.get('access_token')) {
                AuthService.refreshAccessToken(AuthService.userData.username, AuthService.cookies.get('refresh_token'));
            }

        }
    }
    static logout(){
        AuthService.cookies.remove("refresh_token");
        AuthService.cookies.remove("access_token");
        AuthService.cookies.remove("jwt");
        AuthService.cookies.remove("username");
        AuthService.userData = null;
        AuthService.accessToken = null;
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
            .then((response)=>{
                this.setAccessToken(response.data.accessToken);
                AuthService.cookies.set("refresh_token", response.data.refreshToken,
                    {
                        expires: (new Date()).getTime() * 3600 * 24 * 30
                    }
                );
                return response;
            })
    }
    static login(username, password){
        let cookieOptions =  {
            expires: new Date(Date.now() * 3600 * 24 * 30 * 1000)
        };

       return axios.post('https://chaosnet.schematical.com/v0/auth/login', {
           username:username,
           password: password
       })
       .then((response)=>{
           this.setAccessToken(response.data.accessToken);
           AuthService.cookies.set("refresh_token", response.data.refreshToken,
               cookieOptions
           );
           return response;
       })
       .then((response)=>{


           return AuthService.whoami(response.data.accessToken);

       })
       .then((response)=> {

           AuthService.cookies.set("jwt", JSON.stringify(response.data), cookieOptions);
           AuthService.cookies.set("username", response.data.username, cookieOptions);
       });

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
        let cookieOptions = {};
        cookieOptions.expires = new Date(Date.now() + 60*60000);
        AuthService.cookies.set("access_token", accessToken,
            cookieOptions
        );
    }


}
export default AuthService;