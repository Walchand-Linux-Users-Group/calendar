/*
    I need to get unique id from backend!!!
*/
import Axios from 'axios';

async function getUUID() {

  const response = await Axios.get("http://localhost:5000/api/getuuid");
  const data = await response.data.uuid;

  return data;
}

export async function generateUUID() {
  return (
    getUUID()
  );
}
