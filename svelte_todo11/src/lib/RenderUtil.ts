
export function htmlSend(elem: any): any
{
  try{
    return `<html>${elem}</html>`;
  } catch (e) {
    console.error(e);
  }    
}
