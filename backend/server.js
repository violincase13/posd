const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const xml2js = require('xml2js');

const app = express();
const port = 3001;

// PostgreSQL configuration
const pool = new Pool({
  user: 'admin',
  host: '127.0.0.1',
  database: 'users',
  password: 'admin1234',
  port: 5432, // Default PostgreSQL port
});

// Middleware to parse JSON request body
app.use(bodyParser.json());

//app.use(cors());

// Enable CORS with specific options
app.use(
  cors({
    origin: 'http://localhost:3000', // Replace with the origin of your frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);
// handle preflight requests
app.options('*', cors());

app.use(bodyParser.text({ type: 'application/xml' }));

// Define a simple route for the root path
app.get('/', (req, res) => {
  res.send('Hello, this is your Node.js server!');
});

// Middleware to check if the user is authenticated 
const isAuthenticated = (req, res, next) => {
  const userAuthenticated = true; 
  if (userAuthenticated) {
    next(); // User is authenticated, proceed to the next middleware or route handler
  } else {
    res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }
};

// Middleware to check user role
const checkUserRole = (allowedRoles) => {
  return (req, res, next) => {
    //const userRole = req.body.user_role; // Assuming user_role is sent in the request body, adjust accordingly
    const userRole = req.headers['x-user-role'];


    if (allowedRoles.includes(userRole)) {
      next(); // User has the required role, proceed to the next middleware or route handler
    } else {
      res.status(403).json({ error: 'Access forbidden. Insufficient privileges.' });
    }
  };
};

// Endpoint for user authentication
app.post('/login', async (req, res) => {
  const { user_id, user_alias, user_password, personal_token } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE user_alias = $1 AND user_password = $2 AND personal_token = $3', [user_alias, user_password, personal_token]);
    const user = result.rows[0];
    client.release();

    if (user) {
      // Redirect based on user role
      switch (user.user_role) {
        case 'patient':
          res.json({ redirect: '/patient-dashboard', user_id: user.user_id, user_role: 'patient'});
          break;
        case 'doctor':
          res.json({ redirect: '/doctor-dashboard', user_id: user.user_id, user_role: 'doctor'});
          break;
        case 'doctor_on_duty':
          res.json({ redirect: '/doctor-on-duty-dashboard', user_id: user.user_id, user_role: 'doctor_on_duty'});
          break;
        case 'nurse':
          res.json({ redirect: '/nurse-dashboard', user_id: user.user_id, user_role: 'nurse'});
          break;
        case 'nurse_on_duty':
          res.json({ redirect: '/nurse-on-duty-dashboard', user_id: user.user_id, user_role: 'nurse_on_duty'});
          break;
        case 'manager':
          res.json({ redirect: '/manager-dashboard', user_id: user.user_id, user_role: 'manager'});
          break;
        default:
          res.status(403).json({ error: 'Invalid user role' });
      }
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint for user logout
app.post('/logout', (req, res) => {
  // Add your logout logic here (e.g., clearing server-side session)
  console.log('Logging out on the server...');

  // Send a response indicating successful logout
  res.json({ message: 'Logout successful' });
});

// Endpoint to fetch patient-specific appointments
app.get('/patient-appointments/:id', async (req, res) => {
  const patientId = req.params.id;

  // Mocked XML file path 
  const xmlFilePath = 'patients.xml';

  try {
    const xmlData = fs.readFileSync(xmlFilePath, 'utf-8');

    // Wrap the asynchronous function in a promise
    const parseXml = (xmlData) => {
      return new Promise((resolve, reject) => {
        const parser = new xml2js.Parser();
        parser.parseString(xmlData, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    // Use async/await to handle the asynchronous operation
    const result = await parseXml(xmlData);

    //console.log('Parsed XML Result:', result);

    const patient = result.patients.patient.find((p) => p.$.id === patientId);

    if (patient && patient.appointments && patient.appointments[0].appointment) {
      const patientAppointments = patient.appointments[0].appointment;
      res.json(patientAppointments);
    } else {
      res.status(404).json({ error: 'Patient not found or no appointments available' });
    }
  } catch (error) {
    console.error('Error reading or parsing XML file', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to fetch patient-specific medical records
app.get('/patient-medical-records/:id', async (req, res) => {
  const patientId = req.params.id;
  const xmlFilePath = 'patients.xml';

  try {
    const xmlData = fs.readFileSync(xmlFilePath, 'utf-8');
    const parseXml = (xmlData) => {
      return new Promise((resolve, reject) => {
        const parser = new xml2js.Parser();
        parser.parseString(xmlData, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    const result = await parseXml(xmlData);

    //console.log('Parsed XML Result:', result);

    const patient = result.patients.patient.find((p) => p.$.id === patientId);

    if (patient && patient.medicalRecords && patient.medicalRecords[0].record) {
      const patientMedicalRecords = patient.medicalRecords[0].record;
      res.json(patientMedicalRecords);
    } else {
      res.status(404).json({ error: 'Patient not found or no medical records available' });
    }
  } catch (error) {
    console.error('Error reading or parsing XML file', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to fetch patient-specific medications
app.get('/patient-medications/:id', async (req, res) => {
  const patientId = req.params.id;
  const xmlFilePath = 'patients.xml';

  try {
    const xmlData = fs.readFileSync(xmlFilePath, 'utf-8');
    const parseXml = (xmlData) => {
      return new Promise((resolve, reject) => {
        const parser = new xml2js.Parser();
        parser.parseString(xmlData, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    const result = await parseXml(xmlData);

    //console.log('Parsed XML Result:', result);

    const patient = result.patients.patient.find((p) => p.$.id === patientId);

    if (patient && patient.medications && patient.medications[0].medication) {
      const patientMedications = patient.medications[0].medication;
      res.json(patientMedications);
    } else {
      res.status(404).json({ error: 'Patient not found or no medications available' });
      console.error('Invalid XML structure:', result);
    }
  } catch (error) {
    console.error('Error reading or parsing XML file', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to fetch doctor-specific patients
app.get('/doctor-patients/:id', async (req, res) => {
  const doctorId = req.params.id;
  const xmlFilePath = 'patients.xml';

  try {
    const xmlData = fs.readFileSync(xmlFilePath, 'utf-8');
    const parseXml = (xmlData) => {
      return new Promise((resolve, reject) => {
        const parser = new xml2js.Parser();
        parser.parseString(xmlData, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    const result = await parseXml(xmlData);

    console.log('Parsed XML Result:', result);

    if (result && result.patients && result.patients.patient) {
      const patientArray = Array.isArray(result.patients.patient)
        ? result.patients.patient
        : [result.patients.patient];

      const doctorPatients = patientArray
        .filter((patient) => {
          const doctorIdAttr = patient.appointments[0].appointment[0].doctor[0].$.id;
          return doctorIdAttr === doctorId;
        })
        .map((patient) => {
          const patientId = patient.$.id;
          const appointments = patient.appointments[0].appointment;
          const medicalRecords = patient.medicalRecords && patient.medicalRecords[0].record;

          return {
            patientId: [patientId],
            patientName: [
              `${
                patient.personalData &&
                patient.personalData[0] &&
                patient.personalData[0].firstName[0]
              } ${
                patient.personalData &&
                patient.personalData[0] &&
                patient.personalData[0].lastName[0]
              }`,
            ],
            appointments: appointments.map((appointment) => {
              const appointmentId = appointment.$.id;
              return {
                ...appointment,
                appointmentId: [appointmentId],
              };
            }),
            medicalRecords: medicalRecords || [],
          };
        });

      console.log('Doctor Patients:', doctorPatients);

      if (doctorPatients.length > 0) {
        res.json(doctorPatients);
      } else {
        res.status(404).json({ error: 'Doctor not found or no patients registered' });
      }
    } else {
      console.error('Invalid XML structure:', result);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (error) {
    console.error('Error reading or parsing XML file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to fetch doctor-specific appointments
app.get('/doctor-appointments/:id', async (req, res) => {
  const doctorId = req.params.id;
  const xmlFilePath = 'patients.xml';

  try {
    const xmlData = fs.readFileSync(xmlFilePath, 'utf-8');
    const parseXml = (xmlData) => {
      return new Promise((resolve, reject) => {
        const parser = new xml2js.Parser();
        parser.parseString(xmlData, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    const result = await parseXml(xmlData);

    console.log('Parsed XML Result:', result);

    if (result && result.patients && result.patients.patient) {
      const patientArray = Array.isArray(result.patients.patient)
        ? result.patients.patient
        : [result.patients.patient];

      const doctorAppointments = patientArray
        .filter((patient) => patient.appointments && patient.appointments[0].appointment)
        .flatMap((patient) => {
          const patientId = patient.$.id;
          const appointments = patient.appointments[0].appointment;

          return appointments.map((appointment) => {
            const appointmentId = appointment.$.id;

            if (patient.personalData && patient.personalData[0]) {
              const personalData = patient.personalData[0];
              const patientName = `${personalData.firstName[0]} ${personalData.lastName[0]}`;

              return {
                ...appointment,
                patientId: [patientId],
                patientName: [patientName],
                appointmentId: [appointmentId],
              };
            } else {
              return {
                ...appointment,
                patientId: [patientId],
                patientName: ['Unknown Patient'],
                appointmentId: [appointmentId],
              };
            }
          });
        })
        .filter((appointment) => {
          const doctorIdAttr = appointment.doctor && appointment.doctor[0].$ && appointment.doctor[0].$.id;
          return doctorIdAttr === doctorId;
        });

      console.log('Doctor Appointments:', doctorAppointments);

      if (doctorAppointments.length > 0) {
        res.json(doctorAppointments);
      } else {
        res.status(404).json({ error: 'Doctor not found or no appointments available' });
      }
    } else {
      console.error('Invalid XML structure:', result);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (error) {
    console.error('Error reading or parsing XML file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/modify-appointment/:id', async (req, res) => {
  const doctorId = req.params.id;
  const { appointmentId, modifiedValues } = req.body;
  const xmlFilePath = 'patients.xml';

  try {
    const xmlData = fs.readFileSync(xmlFilePath, 'utf-8');
    const parseXml = (xmlData) => {
      // ... (previous parsing logic)
    };

    const result = await parseXml(xmlData);

    if (result && result.patients && result.patients.patient) {
      const patientArray = Array.isArray(result.patients.patient)
        ? result.patients.patient
        : [result.patients.patient];

      // Find the appointment and update it
      patientArray.forEach((patient) => {
        if (patient.appointments && patient.appointments[0].appointment) {
          const appointments = patient.appointments[0].appointment;
          appointments.forEach((appointment) => {
            if (appointment.$.id === appointmentId && appointment.doctor[0].$ && appointment.doctor[0].$.id === doctorId) {
              Object.assign(appointment, modifiedValues);
            }
          });
        }
      });

      // Save the modified XML data back to the file
      const builder = new xml2js.Builder();
      const modifiedXmlData = builder.buildObject(result);

      fs.writeFileSync(xmlFilePath, modifiedXmlData);

      res.json({ success: true });
    } else {
      console.error('Invalid XML structure:', result);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (error) {
    console.error('Error reading or parsing XML file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to fetch doctor-specific records
app.get('/doctor-records/:id', async (req, res) => {
  const doctorId = req.params.id;
  const xmlFilePath = 'patients.xml';

  try {
    const xmlData = fs.readFileSync(xmlFilePath, 'utf-8');
    const parseXml = (xmlData) => {
      return new Promise((resolve, reject) => {
        const parser = new xml2js.Parser();
        parser.parseString(xmlData, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    const result = await parseXml(xmlData);

    console.log('Parsed XML Result:', result);

    if (result && result.patients && result.patients.patient) {
      const patientArray = Array.isArray(result.patients.patient)
        ? result.patients.patient
        : [result.patients.patient];

      const doctorRecords = patientArray
        .filter((patient) => patient.medicalRecords && patient.medicalRecords[0].record)
        .flatMap((patient) => {
          const patientId = patient.$.id;
          const medicalRecords = patient.medicalRecords[0].record;

          return medicalRecords.map((record) => {
            const recordId = record.$.id;

            if (patient.personalData && patient.personalData[0]) {
              const personalData = patient.personalData[0];
              const patientName = `${personalData.firstName[0]} ${personalData.lastName[0]}`;

              return {
                ...record,
                patientId: [patientId],
                patientName: [patientName],
                recordId: [recordId],
              };
            } else {
              return {
                ...record,
                patientId: [patientId],
                patientName: ['Unknown Patient'],
                recordId: [recordId],
              };
            }
          });
        })
        .filter((record) => {
          const doctorIdAttr = record.doctor && record.doctor[0].$ && record.doctor[0].$.id;
          return doctorIdAttr === doctorId;
        });

      console.log('Doctor medicalRecords:', doctorRecords);

      if (doctorRecords.length > 0) {
        res.json(doctorRecords);
      } else {
        res.status(404).json({ error: 'Doctor not found or no medicalRecords available' });
      }
    } else {
      console.error('Invalid XML structure:', result);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (error) {
    console.error('Error reading or parsing XML file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to fetch all patients' information for a doctor on duty
app.get('/doctor-on-duty-get-patients/:id', async (req, res) => {
  const doctorId = req.params.id;
  const xmlFilePath = 'patients.xml';

  try {
    const xmlData = fs.readFileSync(xmlFilePath, 'utf-8');
    const parseXml = (xmlData) => {
      return new Promise((resolve, reject) => {
        const parser = new xml2js.Parser();
        parser.parseString(xmlData, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    const result = await parseXml(xmlData);

    console.log('Parsed XML Result:', result);

    if (result && result.patients && result.patients.patient) {
      const patientArray = Array.isArray(result.patients.patient)
        ? result.patients.patient
        : [result.patients.patient];

      const doctorOnDutyPatients = patientArray
        .flatMap((patient) => {
          const patientId = patient.$.id;
          const appointments = patient.appointments && patient.appointments[0].appointment;
          const medicalRecords = patient.medicalRecords && patient.medicalRecords[0].record;

          if (appointments && medicalRecords) {
            return {
              patientId: [patientId],
              patientName: [
                `${
                  patient.personalData &&
                  patient.personalData[0] &&
                  patient.personalData[0].firstName[0]
                } ${
                  patient.personalData &&
                  patient.personalData[0] &&
                  patient.personalData[0].lastName[0]
                }`,
              ],
              appointments: appointments.map((appointment) => {
                const appointmentId = appointment.$.id;
                return {
                  ...appointment,
                  appointmentId: [appointmentId],
                };
              }),
              medicalRecords: medicalRecords || [],
            };
          } else {
            return null;
          }
        })
        .filter((patient) => patient !== null);

      console.log('Doctor On Duty Patients:', doctorOnDutyPatients);

      if (doctorOnDutyPatients.length > 0) {
        res.json(doctorOnDutyPatients);
      } else {
        res.status(404).json({ error: 'No patients available for the doctor on duty' });
      }
    } else {
      console.error('Invalid XML structure:', result);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (error) {
    console.error('Error reading or parsing XML file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Endpoint for nurses to get only doctors on duty
app.get('/doctors-on-duty', async (req, res) => {
  try {
    const client = await pool.connect();
    
    // Assuming user_role is a column in your 'users' table
    const result = await client.query('SELECT * FROM users WHERE user_role = $1', ['doctor_on_duty']);
    
    const doctorsOnDuty = result.rows;
    client.release();

    if (doctorsOnDuty.length > 0) {
      res.json(doctorsOnDuty);
    } else {
      res.status(404).json({ error: 'No doctors on duty found' });
    }
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to fetch nurse-specific interventions
app.get('/nurse-interventions/:id', async (req, res) => {
  const nurseId = req.params.id;
  const xmlFilePath = 'patients.xml';

  try {
    const xmlData = fs.readFileSync(xmlFilePath, 'utf-8');
    const parseXml = (xmlData) => {
      return new Promise((resolve, reject) => {
        const parser = new xml2js.Parser();
        parser.parseString(xmlData, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    const result = await parseXml(xmlData);

    console.log('Parsed XML Result:', result);

    if (result && result.patients && result.patients.patient) {
      const patientArray = Array.isArray(result.patients.patient)
        ? result.patients.patient
        : [result.patients.patient];

      const nurseMedicalRecordsInterventionsData = patientArray
        .filter((patient) => patient.medicalRecords && patient.medicalRecords[0].record)
        .flatMap((patient) => {
          const patientId = patient.$.id;
          const records = patient.medicalRecords[0].record;

          return records.map((record) => {
            const recordId = record.$.id;

            if (patient.personalData && patient.personalData[0]) {
              const personalData = patient.personalData[0];
              const patientName = `${personalData.firstName[0]} ${personalData.lastName[0]}`;

              return {
                ...record,
                patientId: [patientId],
                patientName: [patientName],
                recordId: [recordId],
              };
            } else {
              return {
                ...record,
                patientId: [patientId],
                patientName: ['Unknown Patient'],
                recordId: [recordId],
              };
            }
          });
        })
        .filter((record) => {
          const nurseIdAttr = record.lastUpdatedBy && record.lastUpdatedBy[0].$ && record.lastUpdatedBy[0].$.id;
          return nurseIdAttr === nurseId;
        });

      console.log('Nurse records:', nurseMedicalRecordsInterventionsData);

      if (nurseMedicalRecordsInterventionsData.length > 0) {
        res.json(nurseMedicalRecordsInterventionsData);
      } else {
        res.status(404).json({ error: 'Doctor not found or no records available' });
      }
    } else {
      console.error('Invalid XML structure:', result);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (error) {
    console.error('Error reading or parsing XML file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Endpoint for nurse on duty to access all the informtion
app.get('/nurse-on-duty-all-interventions', async (req, res) => {
  const xmlFilePath = 'patients.xml';

  try {
    const xmlData = fs.readFileSync(xmlFilePath, 'utf-8');
    const parseXml = (xmlData) => {
      return new Promise((resolve, reject) => {
        const parser = new xml2js.Parser();
        parser.parseString(xmlData, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    const result = await parseXml(xmlData);

    console.log('Parsed XML Result:', result);

    if (result && result.patients && result.patients.patient) {
      const patientArray = Array.isArray(result.patients.patient)
        ? result.patients.patient
        : [result.patients.patient];

      const allMedicalRecordsData = patientArray
        .filter((patient) => patient.medicalRecords && patient.medicalRecords[0].record)
        .flatMap((patient) => {
          const patientId = patient.$.id;
          const records = patient.medicalRecords[0].record;

          return records.map((record) => {
            const recordId = record.$.id;

            if (patient.personalData && patient.personalData[0]) {
              const personalData = patient.personalData[0];
              const patientName = `${personalData.firstName[0]} ${personalData.lastName[0]}`;

              return {
                ...record,
                patientId: [patientId],
                patientName: [patientName],
                recordId: [recordId],
              };
            } else {
              return {
                ...record,
                patientId: [patientId],
                patientName: ['Unknown Patient'],
                recordId: [recordId],
              };
            }
          });
        });

      console.log('All Medical Records:', allMedicalRecordsData);

      if (allMedicalRecordsData.length > 0) {
        res.json(allMedicalRecordsData);
      } else {
        res.status(404).json({ error: 'No medical records available' });
      }
    } else {
      console.error('Invalid XML structure:', result);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (error) {
    console.error('Error reading or parsing XML file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// endpoint to fetch all users
app.get('/users', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users');
    const users = result.rows;
    client.release();

    res.json(users);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example endpoint to fetch all users
app.get('/users', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users');
    const users = result.rows;
    client.release();

    res.json(users);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// endpoint for manager to fetch users with specific user roles
app.get('/doctors', async (req, res) => {
  try {
    const client = await pool.connect();

    // Use parameterized query to prevent SQL injection
    const result = await client.query('SELECT * FROM users WHERE user_role = $1 OR user_role = $2', ['doctor', 'doctor_on_duty']);
    const nurses = result.rows;

    client.release();

    res.json(nurses);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// endpoint for manager to fetch users with specific user roles
app.get('/nurses', async (req, res) => {
  try {
    const client = await pool.connect();

    // Use parameterized query to prevent SQL injection
    const result = await client.query('SELECT * FROM users WHERE user_role = $1 OR user_role = $2', ['nurse', 'nurse_on_duty']);
    const nurses = result.rows;

    client.release();

    res.json(nurses);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});