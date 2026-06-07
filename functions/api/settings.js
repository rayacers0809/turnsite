import { onRequestOptions, fs, val, docToObj, json } from "./_common.js";
export { onRequestOptions };
const DEFAULT={discordUrl:"https://discord.gg/2026turn",connectUrl:"sv.dolp.kr",discordGuildId:"1063771391339536385",discordPanelChannelId:"1388792187642187786",discordPanelMessageIds:[]};
export async function onRequestGet(){try{const data=await fs("settings/site");const s=data.fields?docToObj(data):DEFAULT;delete s.id;return json({...DEFAULT,...s});}catch(e){return json(DEFAULT);}}
export async function onRequestPost({request}){try{const body={...DEFAULT,...await request.json()};await fs("settings/site",{method:"PATCH",body:JSON.stringify({fields:Object.fromEntries(Object.entries(body).map(([k,v])=>[k,val(v)]))})});return json({ok:true});}catch(e){return json({ok:false,error:String(e.message||e)},200);}}
