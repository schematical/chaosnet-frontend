export default class ChaosPixelColorHelper{
    static getNESColors() {
        return [
        "FF000000",
        "FFfcfcfc",
        "FFf8f8f8",
        "FFbcbcbc",
        "FF7c7c7c",
        "FFa4e4fc",
        "FF3cbcfc",
        "FF0078f8",
        "FF0000fc",
        "FFb8b8f8",
        "FF6888fc",
        "FF0058f8",
        "FF0000bc",
        "FFd8b8f8",
        "FF9878f8",
        "FF6844fc",
        "FF4428bc",
        "FFf8b8f8",
        "FFf878f8",
        "FFd800cc",
        "FF940084",
        "FFf8a4c0",
        "FFf85898",
        "FFe40058",
        "FFa80020",
        "FFf0d0b0",
        "FFf87858",
        "FFf83800",
        "FFa81000",
        "FFfce0a8",
        "FFfca044",
        "FFe45c10",
        "FF881400",
        "FFf8d878",
        "FFf8b800",
        "FFac7c00",
        "FF503000",
        "FFd8f878",
        "FFb8f818",
        "FF00b800",
        "FF007800",
        "FFb8f8b8",
        "FF58d854",
        "FF00a800",
        "FF006800",
        "FFb8f8d8",
        "FF58f898",
        "FF00a844",
        "FF005800",
        "FF00fcfc",
        "FF00e8d8",
        "FF008888",
        "FF004058",
        "FFf8d8f8",
        "FF787878"
        ]
    }
    static matchNESPixel(){
        

    }
    static isTransparent(c){
        let bgColor = this.hexToRgb(this.options.background_color);
        let rMin = c[0] - this.options.background_color_range;
        let rMax = c[0] + this.options.background_color_range;

        if(
            bgColor.r > rMin &&
            bgColor.r < rMax &&
            bgColor.g > c[1] - this.options.background_color_range  &&
            bgColor.g < c[1] + this.options.background_color_range &&
            bgColor.b > c[2] - this.options.background_color_range  &&
            bgColor.b < c[2] + this.options.background_color_range
        ) {
            return true;
        }

        return false;
    }
    static hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    static componentToHex(c){
        var hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }
    static rgbToHex(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }
}

