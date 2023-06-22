const prompt = require('prompt-sync')();
const { MongoClient } = require('mongodb');

class Politician {
  constructor(name) {
    this.name = name;
    this.votes = 0;
  }
}

class Election {
  constructor() {
    this.politicians = [];
  }

  addPolitician(politician) {
    this.politicians.push(politician);
  }

  recordVotes() {
    const numberOfPoliticians = this.politicians.length;
    const votesPerPolitician = parseInt(prompt('Enter the number of votes per politician: '));

    for (const politician of this.politicians) {
      politician.votes = votesPerPolitician;
    }
  }

  calculateTotalVotes() {
    let totalVotes = 0;

    for (const politician of this.politicians) {
      totalVotes += politician.votes;
    }

    return totalVotes;
  }
}

async function main() {
  const uri = 'mongodb+srv://vishnujbsc22:vishnu11@cluster0.19b90ml.mongodb.net/?retryWrites=true&w=majority'; // MongoDB connection URI
  const client = new MongoClient(uri);

  try {
    await client.connect(); // Connect to the MongoDB server
    console.log('Connected to MongoDB');

    const db = client.db('election'); // Specify the database name
    const collection = db.collection('politicians'); // Specify the collection name

    const election = new Election();

    const politician1 = new Politician('Politician 1');
    const politician2 = new Politician('Politician 2');
    const politician3 = new Politician('Politician 3');

    election.addPolitician(politician1);
    election.addPolitician(politician2);
    election.addPolitician(politician3);

    election.recordVotes();

    const totalVotes = election.calculateTotalVotes();
    console.log('Total number of votes:', totalVotes);

    // CRUD operations with MongoDB
    // Create
    await collection.insertMany(election.politicians);
    console.log('Politicians added to the collection');

    // Read
    const politicians = await collection.find().toArray();
    console.log('All politicians:', politicians);

    // Update
    const updatedPolitician = await collection.updateOne(
      { name: 'Politician 1' },
      { $set: { votes: 1000 } }
    );
    console.log('Politician 1 votes updated');

    // Delete
     const deletedPolitician = await collection.deleteOne({ name: 'Politician 2' });
     console.log('Politician 2 deleted');

    // Read after modifications
    const updatedPoliticians = await collection.find().toArray();
    console.log('Updated politicians:', updatedPoliticians);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close(); // Close the MongoDB connection
    console.log('Disconnected from MongoDB');
  }
}

main();