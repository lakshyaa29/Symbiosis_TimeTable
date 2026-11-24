const {makeCloud}=require('../lib/cloud.cjs');
const cloud=makeCloud();
module.exports=async(req,res)=>{if(!await cloud.handle(req,res)){res.statusCode=503;res.end('Cloud setup required. See DEPLOYMENT.md.');}};
