
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// File path to store pets data
const petsFilePath = 'pets.json';

// Helper function to read pets data from file
const readPetsData = async () => {
  try {
    const data = await fs.readFile(petsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to write pets data to file
const writePetsData = async (pets) => {
  await fs.writeFile(petsFilePath, JSON.stringify(pets, null, 2), 'utf8');
};

// GET /pets: Retrieve a list of Pets
app.get('/pets', async (req, res) => {
  try {
    const pets = await readPetsData();
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /pets: Add a new Pet
app.post('/pets', async (req, res) => {
  try {
    const newPet = req.body;
    const pets = await readPetsData();

    // Assign a unique ID to the new pet
    newPet.id = pets.length + 1;
    
    pets.push(newPet);
    await writePetsData(pets);

    res.json(newPet);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /pets: Edit a pet (Bonus)
app.put('/pets/:id', async (req, res) => {
  try {
    const petId = parseInt(req.params.id);
    const updatedPet = req.body;
    let pets = await readPetsData();

    // Find the index of the pet with the given ID
    const petIndex = pets.findIndex((pet) => pet.id === petId);

    if (petIndex !== -1) {
      // Update the pet data
      pets[petIndex] = { ...pets[petIndex], ...updatedPet };
      await writePetsData(pets);
      res.json(pets[petIndex]);
    } else {
      res.status(404).json({ error: 'Pet not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/', (req, res) => {
    res.send('Welcome to the Pet API');
  });


app.get('/pets/:id', async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const pets = await readPetsData();
  
      // Find the pet with the given ID
      const pet = pets.find((pet) => pet.id === petId);

      console.log(pet)
  
      if (pet) {
        res.json(pet);
      } else {
        res.status(404).json({ error: 'Pet not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  app.listen(PORT, (error) => {
    if (error) {
      console.error(`Error starting the server: ${error.message}`);
    } else {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log('after server');
    }
  });
  
  console.log('before server');
  