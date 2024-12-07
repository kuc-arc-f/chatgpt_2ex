
const ClientUtil = {
  
  //
  getSysApiUrl: async function(){
    try{
      let ret = "";
      const response = await fetch(`/api/common/get_sys_items`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }
      );
      if (!response.ok) throw new Error("error, getSystemParam");
      const data = await response.json();
      //console.log(data.data);
      ret = data.data.api_url;
      return ret;
    } catch (err) {
      console.error(err);
    }
  }

}
export default ClientUtil;