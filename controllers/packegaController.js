const express = require('express');
const cors = require('cors');

const packegadb = require('../models/packega');

const app = express();
app.use(cors());
app.use(express.json());

const PackegaCreate = async (req, res) => {
    const packegas = req.body; // Expecting an array of objects
  
    if (!Array.isArray(packegas) || packegas.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid data format' });
    }
  
    const values = packegas.map(pkg => [pkg.name, pkg.numberofclass, pkg.description]);
  
    try {
      const [result] = await packegadb.query(
        'INSERT INTO packega (name, numberofclass, description) VALUES ?',
        [values]
      );
  
      res.status(201).json({
        success: true,
        message: `${result.affectedRows} packegas created successfully`,
        insertedCount: result.affectedRows
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to create packegas' });
    }
  };
  

const PackegaById = async (req, res) => {
  try {
    const [rows] = await packegadb.query('SELECT * FROM packega WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching packega' });
  }
};

const PackegaAllshow = async (req, res) => {
  try {
    const [rows] = await packegadb.query('SELECT * FROM packega');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all packega' });
  }
};

module.exports = {
  PackegaCreate,
  PackegaById,
  PackegaAllshow,
};
