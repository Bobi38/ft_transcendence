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