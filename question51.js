const express = require('express');
const mongoose = require('mongoose');

// Connect to MongoDB
const mongoURI = 'mongodb+srv://vishnujbsc22:vishnu11@cluster0.19b90ml.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB URI
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
  });

// Define the Party schema
const partySchema = new mongoose.Schema({
  name: String,
  politicians: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Politician' }]
});

// Define the Politician schema
const politicianSchema = new mongoose.Schema({
  party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
  votes: Number,
  money: Number
});

// Create the Party model
const Party = mongoose.model('Party', partySchema);

// Create the Politician model
const Politician = mongoose.model('Politician', politicianSchema);

// Create the Express app
const app = express();
app.use(express.json());

app.post('/parties', async (req, res) => {
  try {
    const parties = [];

    let numParties = 2; // Set the number of parties

    // Retrieve preexisting parties from MongoDB
    const existingParties = await Party.find().exec();
    parties.push(...existingParties);

    // Get party details
    for (let i = 0; i < numParties; i++) {
      const partyName = `Party ${i + 1}`;
      const party = new Party({ name: partyName });
      await party.save();
      parties.push(party);
    }

    // Get politician details
    for (let i = 0; i < numParties; i++) {
      const party = parties[i];

      const politician = new Politician({
        party: party._id,
        votes: Math.floor(Math.random() * 100),
        money: Math.random() * 10000
      });

      party.politicians.push(politician);
      await politician.save();
      await party.save();
    }

    console.log('Parties and Politicians:');
    for (let party of parties) {
      console.log(`Party: ${party.name}`);

      for (let politicianId of party.politicians) {
        const politician = await Politician.findById(politicianId).exec();
        console.log(`ID: ${politician._id}`);
        console.log(`Votes: ${politician.votes}`);
        console.log(`Money: ${politician.money}`);
        console.log('------------------');
      }
    }

    // Find politician with maximum votes and maximum money
    const maxVotesPolitician = await Politician.findOne().sort({ votes: -1 }).exec();
    const maxMoneyPolitician = await Politician.findOne().sort({ money: -1 }).exec();

    console.log('Politician with Maximum Votes:');
    console.log(`ID: ${maxVotesPolitician._id}`);
    console.log(`Votes: ${maxVotesPolitician.votes}`);
    console.log('------------------');

    console.log('Politician with Maximum Money:');
    console.log(`ID: ${maxMoneyPolitician._id}`);
    console.log(`Money: ${maxMoneyPolitician.money}`);
    console.log('------------------');

    res.send('Data saved successfully!');
  } catch (error) {
    console.error('An error occurred', error);
    res.status(500).send('An error occurred');
  }
});

// Start the server
const port = 6000; // Set the desired port number
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
