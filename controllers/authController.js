const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/enquiry');
const tutordb = require('../models/tutors');
const subjectdb = require('../models/subject');
const locationdb = require('../models/location');
const studentdb = require('../models/student');

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


// Helper function to send email
const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({ from: '"Admin" <tarunbirla2018@gmail.com>', to, subject, html });
    console.log(`✅ Email sent successfully to ${to}`);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

// Create Client & Student API
// const clientAPIPOST = async (req, res) => {
//   const POST_API_KEY_clients = '26ba9cb1b455fad1256c9639deceef185a6d4e39';
//   const POST_API_KEY_recipients = '683f1f10a58ba1920f7315939670bf5de12e2f98';
//   const { user } = req.body;

//   if (
//     !user ||
//     !user.title ||
//     !user.first_name ||
//     !user.last_name ||
//     !user.email ||
//     !user.studentfirstname ||
//     !user.studentlastname ||
//     !user.mobile ||
//     !user.phone
//   ) {
//     return res.status(400).json({ error: 'All fields are required.' });
//   }

//   try {
//     console.log("user", user);

//     // 1. Create Client
//     const responseClient = await axios.post(
//       'https://secure.tutorcruncher.com/api/clients/',
//       {
//         title: user.title,
//         first_name: user.first_name,
//         last_name: user.last_name,
//         email: user.email
//       },
//       {
//         headers: {
//           Authorization: `Token ${POST_API_KEY_clients}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     const clientData = {
//       id: responseClient.data.id,
//       first_name: user.first_name,    // Correct from your own sent data
//       last_name: user.last_name
//     };

//     // 2. Create Student
//     const responseStudent = await axios.post(
//       'https://secure.tutorcruncher.com/api/recipients/',
//       {
//         paying_client: clientData.id,
//         email: user.email,
//         first_name: user.studentfirstname,
//         last_name: user.studentlastname,
//         mobile: user.mobile,
//         phone: user.phone
//       },
//       {
//         headers: {
//           Authorization: `Token ${POST_API_KEY_recipients}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     const studentData = responseStudent.data;

    // 3. Generate and hash password
    // const generatedPassword = Math.random().toString(36).slice(-8);
    // const hashedPassword = await bcrypt.hash(generatedPassword, 10);

//     // 4. Insert into MySQL
//     await studentdb.query(
//       `INSERT INTO student 
//       (studentid, studentfirstname, studentlastname, email, mobile, phone, clientid, clientfirstname, clientlastname, password) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         studentData.id,
//         studentData.first_name,
//         studentData.last_name,
//         studentData.email,
//         studentData.mobile,
//         studentData.phone,
//         clientData.id,
//         clientData.first_name,
//         clientData.last_name,
//         hashedPassword
//       ]
//     );

    // // 5. Send password email
    // const mailHTML = `
    //   <p>Hello ${user.studentfirstname},</p>
    //   <p>Your account has been created successfully.</p>
    //   <p><strong>Generated Password:</strong> ${generatedPassword}</p>
    //   <p>Please change your password after logging in.</p>
    // `;
    // await sendEmail(user.email, 'Your Account Password', mailHTML);

//     res.status(201).json({
//       message: 'Client and student created successfully. Data saved in DB and email sent.',
//       client: responseClient.data,
//       // student: responseStudent.data
//     });

//   } catch (error) {
//     console.error('❌ Error:', error.response?.data || error.message);
//     res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
//   }
// };

const clientAPIPOST = async (req, res) => {
  const { user } = req.body;

  if (
    !user.title ||
    !user.first_name ||
    !user.last_name ||
    !user.email ||
    !user.studentfirstname ||
    !user.studentlastname ||
    !user.studentemail ||     // ✅ Require student's own email
    !user.mobile ||
    !user.phone
  ) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    console.log("Incoming user object:", user);

    const POST_API_KEY_clients = '26ba9cb1b455fad1256c9639deceef185a6d4e39';

    const clientPayload = {
      title: user.title,
      first_name: user.first_name,   // Client First Name
      last_name: user.last_name,     // Client Last Name
      email: user.email               // Client Email
    };

    const responseClient = await axios.post(
      'https://secure.tutorcruncher.com/api/clients/',
      clientPayload,
      {
        headers: {
          Authorization: `Token ${POST_API_KEY_clients}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const clientData = responseClient.data;
    console.log("✅ Client created:", clientData);

    if (clientData && clientData.id) {
      const POST_API_KEY_recipients = '683f1f10a58ba1920f7315939670bf5de12e2f98';

      const studentPayload = {
        paying_client: clientData.id,
        email: user.studentemail,            // ✅ Student Email (different)
        first_name: user.studentfirstname,    // Student First Name
        last_name: user.studentlastname,      // Student Last Name
        mobile: user.mobile,
        phone: user.phone
      };

      const responseStudent = await axios.post(
        'https://secure.tutorcruncher.com/api/recipients/',
        studentPayload,
        {
          headers: {
            Authorization: `Token ${POST_API_KEY_recipients}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const studentData = responseStudent.data;
      console.log("✅ Student created:", studentData);

      
    // 3. Generate and hash password
    const generatedPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      await studentdb.query(
        `INSERT INTO student 
        (studentid, studentfirstname, studentlastname, email, mobile, phone, clientid, clientfirstname, clientlastname,password) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
        [
          studentData.id,
          studentData.first_name,
          studentData.last_name,
          studentData.email,
          studentData.mobile,
          studentData.phone,
          clientData.id,
          clientData.first_name,
          clientData.last_name,
          hashedPassword
        ]
      );

       // 5. Send password email
    const mailHTML = `
    <p>Hello ${user.studentfirstname},</p>
    <p>Your account has been created successfully.</p>
    <p><strong>Generated Password:</strong> ${generatedPassword}</p>
    <p>Please change your password after logging in.</p>
  `;
  await sendEmail(user.email, 'Your Account Password', mailHTML);

      res.status(201).json({
        message: 'Client and student created successfully. Data saved in DB.',
        client: clientData,
        student: studentData
      });

    } else {
      console.error('❌ Client creation failed, Student creation skipped.');
      return res.status(400).json({ error: 'Client creation failed, student not created.' });
    }

  } catch (error) {
    console.error('❌ Error occurred:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
};




// Login API
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [row] = await studentdb.query('SELECT * FROM student WHERE email = ?', [email]);

    if (row.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, row[0].password);

    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: row[0].studentid }, 'secret_key', { expiresIn: '1h' });

    res.status(200).json({ success: true, message: 'Login successful', token, user: row[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Forgot Password API
const forgetpassword = async (req, res) => {
  const { email } = req.body;

  try {
    const [row] = await studentdb.query('SELECT * FROM student WHERE email = ?', [email]);

    if (row.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userID = row[0].studentid;
    const resetLink = `http://localhost:3000/changepassword/${userID}`;
    const emailHTML = `Click the following link to reset your password: <a href="${resetLink}">${resetLink}</a>`;

    await sendEmail(email, 'Password Reset Link', emailHTML);

    res.status(200).json({ success: true, message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Change Password API
const changepassword = async (req, res) => {
  const userId = req.params.studentid;
  const { newPassword } = req.body;
  

  try {
    const [row] = await studentdb.query('SELECT * FROM student WHERE studentid = ?', [userId]);

    if (row.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await studentdb.query('UPDATE student SET password = ? WHERE studentid = ?', [hashedPassword, userId]);

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } 
  
  catch (error) {
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

const GetByIdContractors = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await tutordb.query('SELECT * FROM tutors WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('❌ Error fetching tutor by ID:', err.message);
    res.status(500).json({ error: 'Failed to fetch tutor' });
  }
};






const appointmentsAPIGET =async (req,res)=>{
  const POST_API_KEY_appointments = '1b74f252cd62fd1f8c0709e95f3fee6c70667ee7';
  
    try {
      const response = await axios.get(
        'https://secure.tutorcruncher.com/api/appointments/',
        {
          headers: {
            Authorization: `Token ${POST_API_KEY_appointments}`, // Capital 'T' in Token ✅
            'Content-Type': 'application/json',
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error('get /appointments error:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
    }
  }

const appointmentsAPIPOST = async (req, res) => {
  const POST_API_KEY_appointments = '1b74f252cd62fd1f8c0709e95f3fee6c70667ee7';

  const appointments = req.body; // expecting an array of appointments

  if (!Array.isArray(appointments)) {
    return res.status(400).json({ error: 'Request body must be an array of appointment objects.' });
  }

  try {
    const results = [];

    for (const appointment of appointments) {
      const response = await axios.post(
        'https://secure.tutorcruncher.com/api/appointments/',
        appointment,
        {
          headers: {
            Authorization: `Token ${POST_API_KEY_appointments}`,
            'Content-Type': 'application/json',
          },
        }
      );
      results.push(response.data);
    }

    res.json({ success: true, appointments: results });
  } catch (error) {
    console.error('POST /appointments error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
};
  

const servicesAPIPOST = async (req, res) => {
  const POST_API_KEY_services = 'bff8593a4911ee078cbf180d94b72bd1e56e2f42';

  try {
    const response = await axios.post(
      'https://secure.tutorcruncher.com/api/services/',
      req.body,
      {
        headers: {
          Authorization: `Token ${POST_API_KEY_services}`, // ✅ fixed backticks here
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('POST /services error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
};
  






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
    const enquirydata = response.data;
    console.log('✅Enquiry data to MySQL:', enquirydata);

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
  login,
  forgetpassword,
  changepassword,
  saveAllContractors,
  clientAPIPOST,
  enquiryAPIPOST,
  subjectsAPIGET,
  contractor_availabilityAPIGET,
  appointmentsAPIPOST,
  appointmentsAPIGET,
  GetallContractors,
  GetAlldatasubject,
  locationAPIGET,
  GetAlldatalocation,
  GetByIdContractors,
  servicesAPIPOST,
 
};
