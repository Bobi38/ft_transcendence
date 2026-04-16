export default async function useFetch(url, type_request, callbacksucces = null, callbackfail = null){
    try {

        const response = await fetch(url, type_request);

        const repjson = await response.json();
        repjson.status = response.status
        if (response.status >= 500){
            return repjson;
        }
        console.log(response.username)
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
            return repjson;

        } else {
            if (callbackfail){
                callbackfail(repjson);
                return repjson
            }
            return repjson
        }
    }catch(error){
        console.log("Failed to fetch ressource:", error);
        return null;
    }
}