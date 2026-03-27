export default async function useFetch(url, type_request, callbacksucces = null, callbackfail = null){
    console.log("useFetch(1) url:", url);
    try {

        const response = await fetch(url, type_request);
        console.log("useFetch(2) after fetch response:", response);

        const repjson = await response.json();
        if (response.status >= 500){
            console.log("useFetch(3) response.status >= 500", repjson.message)
            return null;
        }
        
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

const serviceMap = {
  auth: 'http://auth:9005',
  oauth2: 'http://auth:9005',
  secu: 'http://auth:9005',
  profile: 'http://user_service:9003',
  friend: 'http://user_service:9003',
  chatG: 'http://chatg_service:9001',
  chatP: 'http://chatp_service:9002',
  pong3d: 'http://pong3d:2567',
  morpion: 'http://morpion:9004',
};

/**
 * fetchApi : wrapper pour appeler le gateway d'abord, puis fallback direct si down
 * @param {string} path - chemin de l'API (ex: '/auth/login')
 * @param {object} options - fetch options (method, headers, body, etc.)
 */
export async function fetchApi(path, options = {}) {
  const gatewayUrl = `/api${path}`;
  try {
    const res = await fetch(gatewayUrl, options);
    if (!res.ok) throw new Error(`Gateway responded with status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Gateway down, fallback direct:', err);
    const key = path.split('/')[1];
    const serviceUrl = serviceMap[key];
    if (!serviceUrl) throw new Error(`No fallback service defined for path: ${path}`);
    const directRes = await fetch(`${serviceUrl}${path}`, options);
    if (!directRes.ok) throw new Error(`Direct service responded with status ${directRes.status}`);
    return await directRes.json();
  }
}
    // async function namefct(){
    //     if (!goToConv)
    //         return;

        // const url = `/api/auth/login`;

        // console.log(`${url}`)

    //     const repjson = await useFetch(`${url}`, {
    //         method: "POST",
    //         headers: {'Content-Type': 'application/json'},
    //         credentials: "include",
    //     })
    //     if (!repjson)
    //         return;
    // }
// import useFetch from "HOOKS/useFetch.jsx";