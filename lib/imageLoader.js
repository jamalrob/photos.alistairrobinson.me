export const imageKitLoader = ({ src, width, quality }) => {
    if(src[0] === "/") src = src.slice(1);
    const params = [`w-${width}`];
    if (quality) {
        params.push(`q-${quality}`);
    }
    const paramsString = params.join(",");
    var urlEndpoint = "https://ik.imagekit.io/alistairrobinson/";
    if(urlEndpoint[urlEndpoint.length-1] === "/") urlEndpoint = urlEndpoint.substring(0, urlEndpoint.length - 1);
    src = src.split(' ').join('%20');

    // Using path params, like this:
    // https://ik.imagekit.io/demo/tr:w-200/medium_cafe_B1iTdD0C.jpg
    return `${urlEndpoint}/tr:${paramsString}/${src}`
}