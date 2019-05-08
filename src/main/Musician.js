const dgram = require('dgram');
const uuid = require('uuid');
const protocol = require('./sensor-protocol');


/*
 * We use a standard Node.js module to work with UDP
 */

/*
 * Let's create a datagram socket. We will use it to send our UDP datagrams
 */
const s = dgram.createSocket('udp4');

/*
 * Let's define a javascript class for our musician. The constructor accepts
 * a location, an initial temperature and the amplitude of temperature variation
 * at every iteration
 */
function Musician(instrument) {
  // eslint-disable-next-line global-require,no-unused-vars
  this.id = uuid.v4();
  switch (instrument) {
    case 'piano':
      this.sound = 'ti-ta-ti';
      break;
    case 'trumpet':
      this.sound = 'pouet';
      break;
    case 'flute':
      this.sound = 'trulu';
      break;
    case 'violin':
      this.sound = 'gzi-gzi';
      break;
    case 'drum':
      this.sound = 'boum-boum';
      break;
    default:
      console.log('Unknown instrument');
  }

  /*
   * We will simulate sound changes on a regular basis. That is something that
   * we implement in a class method (via the prototype)
   */
  Musician.prototype.update = function () {
    const time = new Date();
    const measure = {
      timestamp: time,
      uuid: this.id,
      sound: this.sound,
    };
    /*
       * Let's create the measure as a dynamic javascript object,
       * add the 3 properties (timestamp, location and temperature)
       * and serialize the object to a JSON string
       */
    const payload = JSON.stringify(measure);

    /*
       * Finally, let's encapsulate the payload in a UDP datagram, which we publish on
       * the multicast address. All subscribers to this address will receive the message.
       */
    // eslint-disable-next-line no-undef,no-buffer-constructor
    const message = Buffer.from(payload);
    s.send(message, 0, message.length,
      protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS);
    // eslint-disable-next-line no-use-before-define
    sleep(1000);
  };

  /*
   * Let's take and send a measure every 500 ms
   */
  setInterval(this.update.bind(this), 500);

  function sleep(milliseconds) {
    const start = new Date().getTime();
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds) {
        break;
      }
    }
  }
}

/*
 * Let's get the thermometer properties from the command line attributes
 * Some error handling wouln't hurt here...
 */
const instrument = process.argv[2];

/*
 * Let's create a new Musician - the regular publication of measures will
 * be initiated within the constructor
 */
// eslint-disable-next-line no-new
new Musician(instrument);
