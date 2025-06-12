import { ValueDTO } from "../types/graph";

export async function executeEvent(url: string, value: ValueDTO) {
  return await fetch(url, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Accept-Content': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value)
  })
}

