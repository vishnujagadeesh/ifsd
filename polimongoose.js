const prompt = require('prompt-sync')();
const mongoose = require('mongoose');

// Define the schema for the Politician model
const politicianSchema = new mongoose.Schema({
  name: String,
  votes: Number
});

// Create the Politician model based on the schema
const PoliticianModel = mongoose.model('Politician', politicianSchema);

// MongoDB connection setup
mongoose.connect('mongodb+srv://vishnujbsc22:vishnu11@cluster0.19b90ml.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

class Politician {
  constructor(name) {
    this.name = name;
    this.votes = 0;
  }

  save() {
    const politician = new PoliticianModel({
      name: this.name,
      votes: this.votes
    });

    return politician.save();
  }

  updateVotes(votes) {
    this.votes = votes;

    return PoliticianModel.findOneAndUpdate({ name: this.name }, { votes: this.votes }).exec();
  }

  static getAll() {
    return PoliticianModel.find().exec();
  }

  static deleteAll() {
    return PoliticianModel.deleteMany().exec();
  }
}

class Election {
  constructor() {
    this.politicians = [];
  }

  async addPolitician(politician) {
    await politician.save();
    this.politicians.push(politician);
  }

  recordVotes() {
    const numberOfPoliticians = this.politicians.length;
    const votesPerPolitician = parseInt(prompt('Enter the number of votes per politician: '));

    for (const politician of this.politicians) {
      politician.updateVotes(votesPerPolitician);
    }
  }

  async calculateTotalVotes() {
    let totalVotes = 0;

    const politicians = await Politician.getAll();
    for (const politician of politicians) {
      totalVotes += politician.votes;
    }

    return totalVotes;
  }
}

async function main() {
  const election = new Election();

  const politician1 = new Politician('Politician 1');
  const politician2 = new Politician('Politician 2');
  const politician3 = new Politician('Politician 3');

  await election.addPolitician(politician1);
  await election.addPolitician(politician2);
  await election.addPolitician(politician3);

  election.recordVotes();

  const totalVotes = await election.calculateTotalVotes();
  console.log('Total number of votes:', totalVotes);
  
  // Delete all politicians (cleanup)
//   await Politician.deleteAll();
  
  // Close MongoDB connection
  mongoose.disconnect();
}

main();