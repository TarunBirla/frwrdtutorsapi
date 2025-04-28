const axios = require('axios');
const appointmentdb = require('../models/appointments');

const saveAllAppointments = async (req, res) => {
  const API_KEY = '1b74f252cd62fd1f8c0709e95f3fee6c70667ee7';

  try {
    const { data } = await axios.get('https://secure.tutorcruncher.com/api/appointments/', {
      headers: { Authorization: `Token ${API_KEY}` },
    });

    const appointmentsList = data.results;

    for (const app of appointmentsList) {
      const { data: full } = await axios.get(
        `https://secure.tutorcruncher.com/api/appointments/${app.id}`,
        { headers: { Authorization: `Token ${API_KEY}` } }
      );

      const insertQuery = `
        INSERT INTO appointment (
          id, start, finish, units, topic, status, is_deleted, location, rcras, cjas, service
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          topic = VALUES(topic), 
          status = VALUES(status),
          is_deleted = VALUES(is_deleted),
          location = VALUES(location),
          rcras = VALUES(rcras),
          cjas = VALUES(cjas),
          service = VALUES(service)
      `;

      await appointmentdb.query(insertQuery, [
        full.id,
        new Date(full.start),
        new Date(full.finish),
        parseFloat(full.units),
        full.topic,
        full.status,
        full.is_deleted,
        JSON.stringify(full.location),
        JSON.stringify(full.rcras),
        JSON.stringify(full.cjas),
        JSON.stringify(full.service),
      ]);

      console.log(`✅ Saved appointment ${full.id}`);
    }

    res.json({ message: "All appointments saved in single table." });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

const GetallAppointments = async (req, res) => {
  try {
    const [rows] = await appointmentdb.query('SELECT * FROM appointment_all');
    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching appointments:', err.message);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

module.exports = {
  saveAllAppointments,
  GetallAppointments
};
