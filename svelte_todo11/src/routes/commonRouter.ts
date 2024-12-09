import express from 'express';
const router = express.Router();
import todoData from './todoData';

/**
* 
* @param
*
* @return
*/ 
router.post('/send_post', async function(req: any, res: any) {
  const retObj = {ret: 500 , message: "" }
  try {
    return res.json(retObj);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
router.post('/get_sys_items', async function(req: any, res: any) {
  const retObj = {ret: 500 , message: "" }
  try {
    if(!req.body){
      throw new Error("nothing, body");
    }
    const body = req.body;
    //console.log(body);
    retObj.ret = 200;
    retObj.data = { api_url: process.env.EXTERNAL_API_URL};
    return res.json(retObj);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

export default router;
