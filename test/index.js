const child = require('child_process');
const readline = require('readline');
const modulepath = './index.js';

const unitid = 'plugin_pcd'
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const params = {
  lport: 9090,
  rhost: '192.168.0.109',
  rport: 88,
}

const config = [];

const ps = child.fork(modulepath, [unitid]);

ps.on('message', data => {
  if (data.type === 'get' && data.tablename === 'params/plugin_pcd') {
    ps.send({ type: 'get', params });
  }

  if (data.type === 'get' && data.tablename === 'config/plugin_pcd') {
    ps.send({ type: 'get', config: {} });
  }

  if (data.type === 'data') {
    console.log('-------------data-------------', new Date().toLocaleString());
    console.log(data.data);
    console.log('');
  }

  if (data.type === 'channels') {
    console.log('-----------channels-----------', new Date().toLocaleString());
    console.log(data.data);
    console.log('');
  }

  if (data.type === 'debug') {
    console.log('-------------debug------------', new Date().toLocaleString());
    console.log(data.txt);
    console.log('');
  }

  if (data.type === 'command') {
    console.log('-------------command------------', new Date().toLocaleString());
    console.log(data);
    console.log('');
  }
});

ps.on('close', code => {
  // console.log('close');
});



function clear() {

}

function command(value) {
  switch (value) {
    case 'exit':
      process.exit();
      break;
    case '+':
      // setTimeout(() => ps.send(temp4), 0);
      break;
    case '-':
      // clear();
      break;
    default:
      break;
  }
  listenKeyboard();
  console.log(value);
}

function listenKeyboard() {
  rl.question('', command);
}


listenKeyboard();

ps.send({type: 'debug', mode: true });
