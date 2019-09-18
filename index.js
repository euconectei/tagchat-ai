const brain = require('brain.js');
const data = require('./data/trainning-data.json');

const net = new brain.recurrent.LSTM();

const trainningData = data.map(item => ({
  input: item.text,
  output: item.category
}));

let time = {
  start: Date.now()
};
console.log(`Início: ${time.start}`)

net.train(
  trainningData,
  {
    iterations: 50,
    log: true,
  }
);
time['end'] = Date.now();
console.log(`Fim: ${time.end}`)
time['sec'] = (time.end - time.start) / 1000;

const output = net.run('fernando boa noite');
console.log(`Tag: ${output} / Classificada em: ${time.sec}s`);