/*
 * We have defined the multicast address and port in a file, that can be imported both by
 * auditor.js and musician.js. The address and the port are part of our simple
 * application-level protocol
 */
const dgram = require('dgram');
const protocol = require('./sensor-protocol');

const musicians = new Map();

/*
 * Server TCP
 */
// eslint-disable-next-line import/order
const net = require('net');

const server = net.createServer((socket) => {
  const now = new Date();
  const response = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const [uuid, pair] of musicians) {
    const date = new Date(pair.activeSince);
    if (now.getTime() - date.getTime() <= 5000) {
      response.push({
        uuid,
        instrument: pair.inst,
        activeSince: date.toISOString(),
      });
    }
  }
  const payload = JSON.stringify(response);
  socket.write(payload);
  socket.write('\r\n');
  socket.pipe(socket);
  socket.destroy();
});

server.listen(2205);

/*
 * We use a standard Node.js module to work with UDP
 */

/*
 * Let's create a datagram socket. We will use it to listen for datagrams published in the
 * multicast group by thermometers and containing measures
 */
const s = dgram.createSocket('udp4');
s.bind(protocol.PROTOCOL_PORT, () => {
  console.log('Joining multicast group');
  s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

/*
 * This call back is invoked when a new datagram has arrived.
 */
// eslint-disable-next-line no-unused-vars
s.on('message', (message) => {
  const jmessage = JSON.parse(message);
  const { uuid } = jmessage;
  const { timestamp } = jmessage;
  const { sound } = jmessage;
  let instrument;
  switch (sound) {
    case 'ti-ta-ti':
      instrument = 'piano';
      break;
    case 'pouet':
      instrument = 'trumpet';
      break;
    case 'trulu':
      instrument = 'flute';
      break;
    case 'gzi-gzi':
      instrument = 'violin';
      break;
    case 'boum-boum':
      instrument = 'drum';
      break;
    default:
      console.log('Unknown instrument');
  }
  const pair = {
    inst: instrument,
    activeSince: timestamp,
  };
  musicians.set(uuid, pair);
  // console.log(`{"uuid":"${uuid}","instrument":"${instrument}", "activeSince":"${
  //  timestamp}"}`);
});
