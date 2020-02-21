import AuthService from "./AuthService";
import config from "../config/default.js";
import production from "../config/production.js";
const _ = require('underscore');


class ConfigService{
    static config = null;
    static init(){
       /* let path = "/config/default.js";
        ConfigService.config = require(path);*/
        ConfigService.config = config;

        switch(process.env.NODE_ENV){
            case('production'):
                _.extend(ConfigService.config, production);
            break;
        }
        console.log("CONFIG:", config);
    }
}
export default ConfigService;