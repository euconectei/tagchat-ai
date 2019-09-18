const fs = require('fs');
const readline = require('readline');
const brain = require('brain.js');

const dataLearnedFile = './data/learned.json';
const dataTrainingFile = './data/trainning-data.json';

const net = new brain.recurrent.LSTM();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let trainingData = [];

const train = () => {
  fs.readFile(dataTrainingFile, (err, data) => {
    console.log('Getting data...')
    trainingData = JSON.parse(data.toString());
    trainingData = trainingData.map(item => ({
      input: item.text,
      output: item.category
    }));

    console.log('Training using data...');
    net.train(
      trainingData,
      {
        iterations: 100,
        log: true,
      }
    );

    console.log(net.toJSON());

    console.log('Wrinting learned data...');
    fs.writeFile(dataLearnedFile, JSON.stringify(net.toJSON()), (err) => {
      if (!err) console.log("File Written");
    });
  });
}

const boot = () => {
  rl.question('Enter: ', (text) => {
    if (typeof text === 'undefined') return;
    try {
      res = net.run(text);
    } catch (e) {
      console.log(e)
      res = "Sorry, I dont know that.";
    }
    console.log(res)
    boot();
  });
}

fs.readFile(dataLearnedFile, (err, data) => {
  if (err) throw err;

  if (data.toString() === '') {
    console.log('Training network...');
    train();
  } else {
    console.log('Network alread trained...');
    data = data.toString();
    net.fromJSON(JSON.parse(data));
    boot();
  }
});