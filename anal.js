// Send hits

function sendData(full_endpoint, secret_key, payload, data) {
  payload.date = formatDatetime(payload.timestamp).split("T")[0];
  payload.date_time = formatDatetime(payload.timestamp);
  
  payload.user_agent = parseUa().ua;
  payload.browser_name = parseUa().browser.name;
  payload.browser_version = parseUa().browser.version;
  payload.device_vendor = parseUa().device.vendor;
  payload.device_model = parseUa().device.model;
  payload.device_type = parseUa().device.type;
  payload.os_name = parseUa().os.name;
  payload.os_version = parseUa().os.version;
  
  if(data.enable_logs){console.log('👉 Request payload: ', payload);}
  if(data.enable_logs){console.log('🟢 Analytics consent granted. Sending request...');}

  fetch(full_endpoint, {
    // headers: new Headers({
    //   'Authorization': 'Bearer ' + btoa('secret_key'),
    //   'Content-Type': 'application/json'
    // }),
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    body: JSON.stringify(payload)
  })
  .then((response) => response.json())
  .then((response_json) => {
    if(data.enable_logs){console.log(response_json.response)}
    if (response_json.status_code === 200)
      return data.gtmOnSuccess()
    else return data.gtmOnFailure()
  })
  .catch((error) => {
    if(data.enable_logs){console.log(error)}
    return data.gtmOnFailure()
  })
}

//----------------------------------------------------------------------------------------------------------------------------------------------------

function formatDatetime(timestamp) {
  const date = new Date(timestamp);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Mese è basato su zero
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');

  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}000`;

  return formattedDate;
}

function parseUa(){
  var uap = new UAParser();
  var uap_res = uap.getResult();
  return uap_res
}
