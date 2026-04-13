export default async function useFetch(url, type_request, callbacksucces = null, callbackfail = null){
    // const tab = {
    // "/api/auth/login": true,
    // "/api/auth/register": true,
    // "/api/oauth2/google": true,
    // "/api/oauth2/github": true,
    // "/api/oauth2/github/callback": true,
    // "/api/secu/recupPswd": true,
    // "/api/secu/recupPswd_check_code": true,
    // "/api/secu/majPswd": true,
    // "/api/secu/clearcookie": true,
    // }


    // if (showLog !== AUTH.NONE && !tab[url])
    //     return null;

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
        if (response.login)
            repjson.login = response.login
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
