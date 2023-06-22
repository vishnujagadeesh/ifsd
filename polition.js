const prompt = require('prompt-sync')();

class Politician {
  constructor(name, party, votes, money) {
    this.name = name;
    this.party = party;
    this.votes = votes;
    this.money = money;
  }
}

class Party {
  constructor(name) {
    this.name = name;
    this.politicians = [];
  }

  addPolitician(politician) {
    this.politicians.push(politician);
  }

  getPoliticianWithMax(property) {
    return this.politicians.reduce((maxPolitician, politician) => {
      if (!maxPolitician || politician[property] > maxPolitician[property]) {
        return politician;
      }
      return maxPolitician;
    }, null);
  }
}

function main() {
  const party = new Party(prompt("Enter the name of the party: "));

  const n = parseInt(prompt("Enter the number of politicians: "));

  for (let i = 1; i <= n; i++) {
    console.log(`Politician ${i}:`);
    const name = prompt("Enter the name of the politician: ");
    const votes = parseInt(prompt("Enter the number of votes: "));
    const money = parseFloat(prompt("Enter the amount of money: "));

    const politician = new Politician(name, party.name, votes, money);
    party.addPolitician(politician);
  }

  const politicianWithMaxVotes = party.getPoliticianWithMax("votes");
  console.log(`Politician with the maximum votes: ${politicianWithMaxVotes.name} from ${politicianWithMaxVotes.party}`);

  const politicianWithMaxMoney = party.getPoliticianWithMax("money");
  console.log(`Politician with the maximum money: ${politicianWithMaxMoney.name} from ${politicianWithMaxMoney.party}`);
}

main();