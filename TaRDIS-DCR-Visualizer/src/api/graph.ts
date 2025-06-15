import { ValueDTO } from "../types/graph";

async function executeEvent(url: string, value:any) {
  return await fetch(url, {
    method: 'PUT', // or 'PUT',
    mode: 'cors', // Add this line to enable CORS
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value)
  })
    // .then((response) => response.json())
    // .then((data) => {
    //   console.log('Success:', data);
    // })
  .catch((error) => {
    console.error('Error:', error);
  });
}

async function getEvents(url: string) {
  return await fetch(url, {
    method: 'GET',
    mode: 'no-cors', // Add this line to enable CORS
     })
}


export { executeEvent, getEvents };