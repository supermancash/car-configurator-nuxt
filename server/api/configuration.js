import {initialData} from "~/data/initialConfig.js";
import {selectableData} from "~/data/selectableConfig.js";
import {modelInfo} from "~/data/modelInfo.js";
import * as crypto from "crypto";



let data = [];
export default defineEventHandler(async (e) => {
    const conf = getCookie(e, 'configuration');
    if (e.method === "POST") {
        const body = await readBody(e);

        console.log(body)
        let obj = conf===undefined ?
            {eqAdd: body.equipmentAdded, eqRem: body.equipmentRemoved}
            : JSON.parse(conf);

        setCookie(e, 'configuration', JSON.stringify(obj));
        console.log("====== CONF ========")
        console.log(JSON.parse(getCookie(e, 'configuration')))

        return new Response(JSON.stringify({message: data}), {status: 200})
    }

    const {sessionid} = getQuery(e);
    if (sessionid) {
        return {
            initialData: initialData,
            selectables: selectableData,
            modelData: modelInfo,
            configuration: getCookie(e, 'configuration')===undefined ?
                {} :
                new Object(JSON.parse(getCookie(e, 'configuration')))
        }
    }

    const uuid = crypto.randomUUID();
    setCookie(e, 'sessionid', uuid);

    return {
        sessionid: getCookie(e, 'sessionid'),
        initialData: initialData,
        selectables: selectableData,
        modelData: modelInfo,
    }

})
