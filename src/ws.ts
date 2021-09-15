import ws from 'ws';
import { uuid } from 'uuidv4';

const wss = new ws.Server({ port: 7071 });

const clients = new Map();

wss.on('connection', (ws) => {
  const id = uuid();
  const color = Math.floor(Math.random() * 360);
  const metadata = { id, color };

  clients.set(ws, metadata);

  ws.on('message', (messageAsString: string) => {
    const message = JSON.parse(messageAsString);
    const metadata = clients.get(ws);

    message.sender = metadata.id;
    message.color = metadata.color;

    const outbound = JSON.stringify(message);

    [...clients.keys()].forEach((client) => {
      client.send(outbound);
    });
  })

  ws.on('close', () => {
    clients.delete(ws);
  })
})



wss.on('error', (error: any) => {
  console.error(`Smth went wrong: ${error.message}`);
})