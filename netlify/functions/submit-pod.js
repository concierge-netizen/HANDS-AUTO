const MONDAY_API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjYzNjEzNzc5MSwiYWFpIjoxMSwidWlkIjoxNDk4NzI0NSwiaWFkIjoiMjAyNi0wMy0yMlQxNzoyNTo1MC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6NjYxOTgxNSwicmduIjoidXNlMSJ9.RLTGytTbLaran19E20Ag8nzxdaWuwVKVZNx3fdvAIBQ';
const BOARD_ID = 4550650855;
exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };
  try {
    const { itemId, photoUrl, photoUrl2, photoUrl3, photoUrl4, receivedBy } = JSON.parse(event.body);
    if (!itemId) return { statusCode: 400, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: 'Missing itemId' }) };
    const cols = {};
    if (photoUrl)   cols['link_mm1pgr61'] = { url: photoUrl,  text: 'POD Photo 1' };
    if (photoUrl2)  cols['link_mm1pay5j'] = { url: photoUrl2, text: 'POD Photo 2' };
    if (photoUrl3)  cols['link_mm1pgr61'] = { url: photoUrl3, text: 'POD Photo 3' };
    if (photoUrl4)  cols['link_mm1pay5j'] = { url: photoUrl4, text: 'POD Photo 4' };
    if (receivedBy) cols['text_mm1p831b'] = receivedBy;
    cols['color_mm18camd'] = { label: 'Done' };
    const mutation = 'mutation { change_multiple_column_values(item_id: ' + itemId + ', board_id: ' + BOARD_ID + ', column_values: ' + JSON.stringify(JSON.stringify(cols)) + ') { id } }';
    const res = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': MONDAY_API_TOKEN, 'API-Version': '2023-04' },
      body: JSON.stringify({ query: mutation })
    });
    const result = await res.json();
    if (result.errors) throw new Error(JSON.stringify(result.errors));
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }, body: JSON.stringify({ success: true, updatedItemId: result.data.change_multiple_column_values.id }) };
  } catch(err) {
    return { statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: err.message }) };
  }
};
