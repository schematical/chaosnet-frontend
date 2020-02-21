
import config from "../config/default.js";
import production from "../config/production.js";
import development from "../config/development.js";
const _ = require('underscore');


class ConfigService{
    static config = null;
    static init(){

        ConfigService.config = config;

        switch(process.env.NODE_ENV){
            case('production'):
                _.extend(ConfigService.config, production);
            break;
            case('development'):
                _.extend(ConfigService.config, development);
                break;
            default:
        }
        console.log("CONFIG:", config);
    }
}
export default ConfigService;