import {initialData} from "~/data/initialConfig.js";
import {selectableData} from "~/data/selectableConfig.js";
import {modelInfo} from "~/data/modelInfo.js";
import * as crypto from "crypto";


let data = [];
export default defineEventHandler(async (e) => {
    if (e.method === "POST") {
        const body = await readBody(e);
        console.log(body)
        const index = data.findIndex(el => el.id === body.sessionid);
        let obj = index > -1 ? data[index] : {};
        obj.id = body.sessionid;
        obj.configuration = {eqAdd: body.equipmentAdded, eqRem: body.equipmentRemoved}
        if (index === -1) data.push(obj);

        return new Response(JSON.stringify({message: data}), {status: 200})
    }

    const {sessionid} = getQuery(e);
    if (sessionid) {
        return {
            initialData: initialData,
            selectables: selectableData,
            modelData: modelInfo,
            configuration: data[
                data.findIndex(el => el.id === sessionid)
                ].configuration
        }
    }

    const uuid = crypto.randomUUID();
    setCookie(e, 'sessionid', uuid);

    return new Response(JSON.stringify(
        {
            sessionid: getCookie(e, 'sessionid'),
            initialData: initialData,
            selectables: selectableData,
            modelData: modelInfo,
        }
    ), {status: 200});
})
