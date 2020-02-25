import AuthService from "./AuthService";
import ConfigService from "./ConfigService";

const axios = require('axios');
const _ = require('underscore');


class HTTPService{
    static get(url, options){
        return HTTPService.wrapPromise(
            axios.get(
                ConfigService.config.chaosnet.host + url,
                HTTPService.authRequest(options)
            )
        );
    }
    static post(url, body, options){

        return HTTPService.wrapPromise(
            axios.post(
                ConfigService.config.chaosnet.host + url,
                body,
                HTTPService.authRequest(options)
            )
        );
    }
    static put(url, body, options){

        return HTTPService.wrapPromise(
            axios.put(
                ConfigService.config.chaosnet.host + url,
                body,
                HTTPService.authRequest(options)
            )
        );
    }
    static authRequest(options){
        options = options || {};
        options.headers = options.headers || {};
        if(!options._skipAuth){

            let accessToken = AuthService.getAccessToken();
            if(accessToken && !options.headers.Authorization){
                options.headers.Authorization = accessToken;
            }

        }else{
            delete(options._skipAuth);
        }
        return options;
    }
    static wrapPromise(p){
        return p.catch((err)=>{
            console.error("ERROR - Caught: ", err);
            if(err.request){
                console.log(err.request);
            }
            if (!err.response) {
                throw err;
            }
            console.error("ERROR - status: ", err.response.status)
            switch(err.response.status){
                case(401):
                    document.location.href = "/login";
                break;
                default:
                    throw err;
            }
        })
    }
}
export default HTTPService;