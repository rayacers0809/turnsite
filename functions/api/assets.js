import { onRequestOptions, fs, val, docToObj, json } from "./_common.js";
export { onRequestOptions };
const DEFAULT={iconUrl:"",defaultThumbUrl:"",bgSlides:[],bgInterval:6,bgVideoUrl:""};
export async function onRequestGet(){try{const data=await fs("settings/assets");const assets=data.fields?docToObj(data):DEFAULT;delete assets.id;return json({...DEFAULT,...assets});}catch(e){return json(DEFAULT);}}
export async function onRequestPost({request}){try{const body=await request.json();const assets={...DEFAULT,...body,bgInterval:Number(body.bgInterval||6)};await fs("settings/assets",{method:"PATCH",body:JSON.stringify({fields:Object.fromEntries(Object.entries(assets).map(([k,v])=>[k,val(v)]))})});return json({ok:true});}catch(e){return json({ok:false,error:String(e.message||e)},200);}}
