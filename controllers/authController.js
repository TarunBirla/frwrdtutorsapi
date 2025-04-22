// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const db = require('../models/user');
// const nodemailer = require('nodemailer');
// const { EMAIL_PORT } = process.env;

// // Email transporter setup
// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: EMAIL_PORT,
//   secure: parseInt(EMAIL_PORT) === 465,
//   auth: {
//     user: 'tarunbirla2018@gmail.com',
//     pass: 'lervdzktkcpewuuo',
//   },
// });

// const loggedInUsers = new Set();

// // Register User
// const register = async (req, res) => {
//   const { email, password, firstname, lastname, mobileNumber } = req.body;

//   try {
//     if (!email || !password || !firstname || !lastname || !mobileNumber) {
//       return res.status(400).json({ success: false, message: 'All fields are required' });
//     }

//     const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
//     if (existingUser.length > 0) {
//       return res.status(400).json({ success: false, message: 'Email already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const userImage = req.file ? req.file.filename : null;

//     await db.query('INSERT INTO users (email, password, firstname, lastname, mobileNumber, profileImage) VALUES (?, ?, ?, ?, ?, ?)',
//       [email, hashedPassword, firstname, lastname, mobileNumber, userImage]);

//     res.status(201).json({ success: true, message: 'User registered successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// };

// // Login User
// const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

//     if (user.length === 0 || !(await bcrypt.compare(password, user[0].password))) {
//       return res.status(401).json({ success: false, message: 'Invalid email or password' });
//     }

//     const token = jwt.sign({ userId: user[0].id }, 'secret_key', { expiresIn: '1h' });

//     res.status(200).json({ success: true, message: 'Login successful', token, userid: user[0].id });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// };

// // Update Profile
// const updateprofile = async (req, res) => {
//   const userId = req.params.id;
//   const { email, password, firstname, lastname, mobileNumber } = req.body;

//   try {
//     const [user] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
//     if (!user || user.length === 0) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     const profileImage = req.file ? req.file.filename : user[0].profileImage;
//     const hashedPassword = password ? await bcrypt.hash(password, 10) : user[0].password;

//     await db.query('UPDATE users SET email = ?, password = ?, firstname = ?, lastname = ?, mobileNumber = ?, profileImage = ? WHERE id = ?',
//       [email, hashedPassword, firstname, lastname, mobileNumber, profileImage, userId]);

//     res.status(200).json({ success: true, message: 'Profile updated successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// };

// // Logout User
// const logout = (req, res) => {
//   const userId = req.params.id;
//   loggedInUsers.delete(userId);
//   res.status(200).json({ success: true, message: 'Logout successful' });
// };

// // Get User Profile
// const profile = async (req, res) => {
//   const userId = req.params.id;

//   try {
//     const [user] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

//     if (user.length === 0) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     const userProfile = {
//       id: user[0].id,
//       email: user[0].email,
//       firstname: user[0].firstname,
//       lastname: user[0].lastname,
//       mobileNumber: user[0].mobileNumber,
//       profileImage: user[0].profileImage,
//     };

//     res.status(200).json({ success: true, user: userProfile });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// };

// // Send Email Helper
// const sendEmail = async (to, subject, html) => {
//   try {
//     await transporter.sendMail({ to, subject, html });
//     console.log(`Email sent successfully to ${to}`);
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw error;
//   }
// };

// // Forgot Password
// const forgetpassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const [user] = await db.query('SELECT id, email FROM users WHERE email = ?', [email]);

//     if (!user || user.length === 0) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     const userID = user[0].id;
//     await db.query('UPDATE users SET reset_user_id = ?, resettokenexpires = NOW() + INTERVAL 1 HOUR WHERE id = ?',
//       [userID, userID]);

//     const resetLink = `https://storyfi.hireactjob.in/changepassword/${userID}`;
//     const emailSubject = 'Password Reset Link';
//     const emailHTML = `Click the following link to reset your password: <a href="${resetLink}">${resetLink}</a>`;

//     await sendEmail(user[0].email, emailSubject, emailHTML);

//     res.status(201).json({ success: true, message: 'Password reset link sent to your email' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// };

// // Change Password
// const changepassword = async (req, res) => {
//   const userId = req.params.id;
//   const { newPassword } = req.body;

//   try {
//     const [user] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
//     if (!user || user.length === 0) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

//     res.status(200).json({ success: true, message: 'Password changed successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// };

// module.exports = {
//   register,
//   login,
  // logout,
  // profile,
  // forgetpassword,
  // changepassword,
  // updateprofile
// };











const express = require('express');
const axios = require('axios');
const cors = require('cors');
const user = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/enquiry');
const tutordb = require('../models/tutors');
const subjectdb = require('../models/subject');
const locationdb = require('../models/location');

const app = express();
app.use(cors());
app.use(express.json());



const nodemailer = require('nodemailer');
const { EMAIL_PORT } = process.env;

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: EMAIL_PORT,
  secure: parseInt(EMAIL_PORT) === 465,
  auth: {
    user: 'tarunbirla2018@gmail.com',
    pass: 'lervdzktkcpewuuo',
  },
});
// Register User
const register = async (req, res) => {
  const { email, password, firstname, lastname, mobileNumber } = req.body;

  try {
    if (!email || !password || !firstname || !lastname || !mobileNumber) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const [existingUser] = await user.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userImage = req.file ? req.file.filename : null;

    await user.query(
      'INSERT INTO users (email, password, firstname, lastname, mobileNumber, profileImage) VALUES (?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, firstname, lastname, mobileNumber, userImage]
    );

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Login User
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [row] = await user.query('SELECT * FROM users WHERE email = ?', [email]);

    if (row.length === 0 || !(await bcrypt.compare(password, row[0].password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: row[0].id }, 'secret_key', { expiresIn: '1h' });

    res.status(200).json({ success: true, message: 'Login successful', token, userid: row[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
// Send Email Helper
const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({ to, subject, html });
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Forgot Password
const forgetpassword = async (req, res) => {
  const { email } = req.body;

  try {
    const [row] = await user.query('SELECT id, email FROM users WHERE email = ?', [email]);

    if (!row || row.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userID = row[0].id;

    // ❌ No update here
    const resetLink = `http://localhost:3000/changepassword/${userID}`;
    const emailSubject = 'Password Reset Link';
    const emailHTML = `Click the following link to reset your password: <a href="${resetLink}">${resetLink}</a>`;

    await sendEmail(row[0].email, emailSubject, emailHTML);

    res.status(201).json({ success: true, message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


const changepassword = async (req, res) => {
  const userId = req.params.id;
  const { newPassword } = req.body;

  try {
    // Check if the user with the given ID exists
    const [row] = await user.query('SELECT * FROM users WHERE id = ?', [userId]);

    if (!row || row.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update the user's password in the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const saveAllContractors = async (req, res) => {
  const GET_API_KEY_contractors = 'f0ff47e1026eba404111d5b9b5f3c794876c9de6';
  try {
    // Step 1: Get all contractor summaries
    const { data } = await axios.get('https://secure.tutorcruncher.com/api/contractors/', {
      headers: {
        Authorization: `Token ${GET_API_KEY_contractors}`,
        'Content-Type': 'application/json',
      },
    });

    const contractorList = data.results;

    for (const contractor of contractorList) {
      const contractorId = contractor.id;

      // Step 2: Get full contractor detail by ID
      const { data: fullContractor } = await axios.get(`https://secure.tutorcruncher.com/api/contractors/${contractorId}`, {
        headers: {
          Authorization: `Token ${GET_API_KEY_contractors}`,
          'Content-Type': 'application/json',
        },
      });

      const qualifications = fullContractor.qualifications?.join(', ') || null;

      const subjects = fullContractor.skills.map(skill => skill.subject).filter(Boolean);
      const subjectData = JSON.stringify(subjects);

      const insertQuery = `
        INSERT INTO tutors (id, first_name, last_name, photo, qualifications, subject, town, country)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          first_name = VALUES(first_name),
          last_name = VALUES(last_name),
          photo = VALUES(photo),
          qualifications = VALUES(qualifications),
          subject = VALUES(subject),
          town = VALUES(town),
          country = VALUES(country)
      `;

      await tutordb.query(insertQuery, [
        fullContractor.id,
        fullContractor.first_name,
        fullContractor.last_name,
        fullContractor.photo,
        qualifications,
        subjectData,
        fullContractor.town,
        fullContractor.country,
      ]);

      console.log(`✅ Saved contractor ${contractorId}`);
    }

    res.json({ message: 'All contractors saved successfully.' });
  } catch (error) {
    console.error('❌ Error fetching or saving contractors:', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
};

const GetallContractors =async (req,res)=>{
  try {
    const [rows] = await tutordb.query('SELECT * FROM tutors ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching tutors:', err.message);
    res.status(500).json({ error: 'Failed to fetch tutors' });
  }
}


const clientAPIPOST =async (req,res)=>{
const POST_API_KEY_clients = '26ba9cb1b455fad1256c9639deceef185a6d4e39';

  try {
    const response = await axios.post(
      'https://secure.tutorcruncher.com/api/clients/',
      req.body,
      {
        headers: {
          Authorization: `Token ${POST_API_KEY_clients}`, // Capital 'T' in Token ✅
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('POST /clients error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
}

const appointmentsAPIPOST =async (req,res)=>{
  const POST_API_KEY_appointments = '1b74f252cd62fd1f8c0709e95f3fee6c70667ee7';
  
    try {
      const response = await axios.post(
        'https://secure.tutorcruncher.com/api/appointments/',
        req.body,
        {
          headers: {
            Authorization: `Token ${POST_API_KEY_appointments}`, // Capital 'T' in Token ✅
            'Content-Type': 'application/json',
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error('POST /appointments error:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
    }
  }

const enquiryAPIPOST = async (req, res) => {
  const POST_API_KEY_enquiry = 'f746e91a9d153540ef810b083e20643fbdd28ab7';

  try {
    // First, send data to TutorCruncher Enquiry API
    const response = await axios.post(
      'https://secure.tutorcruncher.com/api/enquiry/',
      req.body,
      {
        headers: {
          Authorization: `Token ${POST_API_KEY_enquiry}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const enquiryId = response.data.id;

    // Save enquiry ID and timestamp to MySQL using the connection pool
    const insertQuery = 'INSERT INTO enquiry (id) VALUES (?)';

    try {
      await db.query(insertQuery, [enquiryId]);
      console.log('✅ Enquiry saved to MySQL:', enquiryId);
    } catch (dbErr) {
      console.error('❌ Error saving enquiry to DB:', dbErr.message);
      // Save error log to DB (optional)
      const errorLogQuery = 'INSERT INTO enquiry_errors (enquiry_id, error_message, created_at) VALUES (?, ?, NOW())';
      try {
        await db.query(errorLogQuery, [enquiryId || null, dbErr.message]);
      } catch (logErr) {
        console.error('❌ Error logging DB error:', logErr.message);
      }
    }

    res.json(response.data);

  } catch (error) {
    console.error('❌ POST /enquiry API error:', error.response?.data || error.message);

    // Save API error to DB (optional)
    const apiError = error.response?.data?.error || error.message || 'Unknown error';
    const errorLogQuery = 'INSERT INTO enquiry_errors (enquiry_id, error_message, created_at) VALUES (?, ?, NOW())';
    try {
      await db.query(errorLogQuery, [null, apiError]);
    } catch (logErr) {
      console.error('❌ Error logging API error:', logErr.message);
    }

    res.status(error.response?.status || 500).json({ error: apiError });
  }
};


const subjectsAPIGET = async (req, res) => {
  const GET_API_KEY_subject = '136c865c2892c12f2ad0929bcefeaa82bd84605a';

  try {
    const response = await axios.get('https://secure.tutorcruncher.com/api/subjects/', {
      headers: {
        Authorization: `Token ${GET_API_KEY_subject}`,
        'Content-Type': 'application/json',
      },
    });

    const subjects = response.data.results;

    for (const subject of subjects) {
      const { id, name, category_id, category_name, custom_to_branch } = subject;

      const query = `
        INSERT INTO subjectAll (id, name, category_id, category_name, custom_to_branch)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          category_id = VALUES(category_id),
          category_name = VALUES(category_name),
          custom_to_branch = VALUES(custom_to_branch);
      `;

      await subjectdb.query(query, [id, name, category_id, category_name, custom_to_branch]);
    }

    res.json({ message: 'Subjects saved to database successfully.' });

  } catch (error) {
    console.error('Error fetching or saving subjects:', error);
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
};

const GetAlldatasubject = async (req, res) => {
  try {
    const [rows] = await subjectdb.query('SELECT * FROM subjectAll');
    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching subjects:', err.message);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
};



const locationAPIGET = async (req, res) => {
  const GET_API_KEY_location = '635a5c12da2b8fceea124d1d38e69da3bdff2c89';

  try {
    const response = await axios.get('https://secure.tutorcruncher.com/api/branch/', {
      headers: {
        Authorization: `Token ${GET_API_KEY_location}`,
        'Content-Type': 'application/json',
      },
    });

    const location = response.data; // it's a single object, not an array
    const { id, name, town } = location;

    const query = `
      INSERT INTO location (id, name, town)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        town = VALUES(town);
    `;

    await locationdb.query(query, [id, name, town]);
    console.log(`✅ Location ${name} saved to database.`);

    res.json({ message: 'Location saved to database successfully.' });

  } catch (error) {
    console.error('❌ Error fetching or saving locations:', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
};




const GetAlldatalocation = async (req, res) => {
  try {
    const [rows] = await locationdb.query('SELECT id, name, town FROM location');
    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching locations:', err.message);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
};



  const contractor_availabilityAPIGET = async (req, res) => {
    const GET_API_KEY_contractors = 'f0ff47e1026eba404111d5b9b5f3c794876c9de6';
    const contractorId = req.params.id;
  
    try {
      const response = await axios.get(`https://secure.tutorcruncher.com/api/contractor_availability/${contractorId}`, {
        headers: {
          Authorization: `Token ${GET_API_KEY_contractors}`,
          'Content-Type': 'application/json',
        },
      });
  
      const contractor = response.data;
     
  
      
  
      console.log("✅ Contractor and subjects saved to DB:", contractor.id);
      res.json(contractor);
    } catch (error) {
      console.error("❌ Error in contractorsbyidAPIGET:", error.message);
      res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
    }
  };

module.exports = {
  register,
  login,
  forgetpassword,
  changepassword,
  saveAllContractors,
  clientAPIPOST,
  enquiryAPIPOST,
  subjectsAPIGET,
  contractor_availabilityAPIGET,
  appointmentsAPIPOST,
  GetallContractors,
  GetAlldatasubject,
  locationAPIGET,
  GetAlldatalocation,
 
};
