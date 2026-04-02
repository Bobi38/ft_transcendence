export default async function useFetch(url, type_request, callbacksucces = null, callbackfail = null){
    console.log("useFetch(1) url:", url);
    try {

        const response = await fetch(url, type_request);
        console.log("useFetch(2) after fetch response:", response);

        const repjson = await response.json();
        repjson.status = response.status
        if (response.status >= 500){
            console.log("useFetch(3) response.status >= 500", repjson.message)
            return repjson;
        }
        
        repjson.status = response.status
        if (response.username)
            repjson.username = response.username
        if (repjson.success) {

            if (callbacksucces){
                callbacksucces(repjson);
                return repjson
            }
            console.log("useFetch(4) success repjson:", repjson);
            return repjson;
            
        } else {
            if (callbackfail){
                callbackfail(repjson);
                return repjson
            }
            console.log("useFetch(5) error back:", repjson.message);
            return repjson
        }
    }catch(error){
        console.log("useFetch(6) error front :", error);
        return null;
    }
}

// FRONT/src/tool/fetchApi.js

// const serviceMap = {
//   auth: 'auth',
//   oauth2: 'auth',
//   secu: 'auth',
// //   profile: 'http://user_service:9003',
// //   friend: 'http://user_service:9003',
// //   chatG: 'http://chatg_service:9001',
// //   chatP: 'http://chatp_service:9002',
// //   pong3d: 'http://pong3d:2567',
// //   morpion: 'http://morpion:9004',
// };

// export async function fetchApi(path, options = {}) {
//   const gatewayUrl = `/api${path}`;
//   try {
//     const res = await fetch(gatewayUrl, options);
//     if (!res.ok) throw new Error(`Gateway responded with status ${res.status}`);
//     return await res.json();
//   } catch (err) {
//     console.warn('Gateway down, fallback direct:', err);
//     const key = path.split('/')[1];
//     const serviceUrl = serviceMap[key];
//     if (!serviceUrl) throw new Error(`No fallback service defined for path: ${path}`);
//     const directRes = await fetch(`${serviceUrl}${path}`, options);
//     if (!directRes.ok) throw new Error(`Direct service responded with status ${directRes.status}`);
//     return await directRes.json();
//   }
// }