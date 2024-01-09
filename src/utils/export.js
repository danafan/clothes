//get导出excel
export function exportExcel(arg,url) {
  arg['admin_id'] = sessionStorage.getItem("admin_id");
  let arg_arr = [];
  for(let k in arg){
    arg_arr.push(`${k}=${arg[k]}`)
  }
  let export_url = `${location.origin}/${url}?${arg_arr.join('&')}`;
  window.open(export_url)
}