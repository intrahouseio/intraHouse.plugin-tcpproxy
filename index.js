const Plugin = require('./lib/plugin');
const net = require("net");

const plugin = new Plugin();


let debug = false;

plugin.on('params', params => {
  start(params);
});

plugin.on('channels', channels => {
  // console.log(channels);
});

plugin.on('debug', mode => {
  debug = mode;
});


function start(options) {


  const localport = options.lport;
  const remotehost = options.rhost;
  const remoteport = options.rport;

  const server = net.createServer(function (localsocket) {
    const remotesocket = new net.Socket();

    remotesocket.connect(remoteport, remotehost);

    localsocket.on('connect', function (data) {
        server.connections,
        localsocket.remoteAddress,
        localsocket.remotePort
    });

    localsocket.on('data', function (data) {
      debug && plugin.debug('--> \r\n' + data.toString())
      try {
        const flushed = remotesocket.write(data);
      } catch (e) {

      }
      if (!flushed) {
        localsocket.pause();
      }
    });

    remotesocket.on('data', function(data) {
      debug && plugin.debug('<-- \r\n' + data.toString())
      try {
        const flushed = localsocket.write(data);
      } catch (e) {

      }
      if (!flushed) {
        remotesocket.pause();
      }
    });

    localsocket.on('drain', function() {
      remotesocket.resume();
    });

    remotesocket.on('drain', function() {
      localsocket.resume();
    });

    localsocket.on('close', function(had_error) {
      remotesocket.end();
    });

    remotesocket.on('close', function(had_error) {
      localsocket.end();
    });

  });

  server.listen(localport);
}
