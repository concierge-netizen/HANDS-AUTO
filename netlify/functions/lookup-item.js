const MONDAY_API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjYzNjEzNzc5MSwiYWFpIjoxMSwidWlkIjoxNDk4NzI0NSwiaWFkIjoiMjAyNi0wMy0yMlQxNzoyNTo1MC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6NjYxOTgxNSwicmduIjoidXNlMSJ9.RLTGytTbLaran19E20Ag8nzxdaWuwVKVZNx3fdvAIBQ';
exports.handler = async function(event) {
  const itemId = event.queryStringParameters && event.queryStringParameters.po;
  if (!itemId) return { statusCode: 400, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: 'Missing po' }) };
  const query = `{ items(ids: [${itemId}]) { id name column_values(ids: ["text4","text5","text","text2","text9"]) { id text } } }`;
  try {
    const res = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': MONDAY_API_TOKEN, 'API-Version': '2023-04' },
      body: JSON.stringify({ query })
    });
    const json = await res.json();
    const item = json.data && json.data.items && json.data.items[0];
    if (!item) return { statusCode: 404, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: 'Not found' }) };
    const cols = {};
    (item.column_values || []).forEach(c => { cols[c.id] = c.text || ''; });
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }, body: JSON.stringify({ poNumber: item.id, itemName: item.name, account: cols['text4']||'', projectName: cols['text5']||'', clientName: cols['text']||'', deliveryDate: cols['text2']||'', deliveryTime: cols['text9']||'' }) };
  } catch(err) {
    return { statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: err.message }) };
  }
};
