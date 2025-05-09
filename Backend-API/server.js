// server.js
import express from 'express';
import webPush from 'web-push';
import cors from 'cors';
import mysql from 'mysql2';
import mysql1 from 'mysql2/promise';
import multer from 'multer';
import path from 'path';
// const fs = require("fs");
import fs1 from 'fs/promises';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import {fileURLToPath}  from 'url';

dotenv.config();

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// Serve static files from the images directory (optional: to access images via URL)
app.use('/images', express.static(path.join(__dirname, 'images')));

// Configure multer for file uploads
const venue_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/venues'); // Ensure this directory exists and has proper permissions
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const user_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/users'); // Ensure this directory exists and has proper permissions
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload_venue_image = multer({ storage: venue_storage });
const upload_user_photo = multer({ storage: user_storage });
let imagePath;

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'venufy',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
const pool1 = mysql1.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'venufy',
  waitForConnections: true,
  connectionLimit: 10,
});

// Test Database Connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the MySQL database');
    connection.release();
  }
});


// Set VAPID details (ideally from environment variables)
webPush.setVapidDetails(
  'mailto:[email protected]',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);


// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,     // e.g., smtp.mailtrap.io
  port: Number(process.env.SMTP_PORT),
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
// Emailing function
async function sendVenueOwnerEmail(ownerEmail, eventData) {
  const mailOptions = {
    from: '"Venufy Notification" <no-reply@venufy.com>',
    to: ownerEmail,
    replyTo: 'no-reply@venufy.com',
    subject: `New booking for ${eventData.venueName}`,
    html: `
      <h2>Your venue <u>${eventData.venueName}</u> has a new booking!</h2>
      <center>
        <p><strong>Event Title:</strong> ${eventData.title}</p>
        <p><strong>Scheduled Date:</strong> ${eventData.date}</p>
        <p><strong>Created by:</strong> ${eventData.createdBy}</p>
      </center>
    `,
  };

  return transporter.sendMail(mailOptions);  // returns a promise :contentReference[oaicite:7]{index=7}
}

// Example API Endpoints

// Example endpoint for sending a push notification
app.post('/send-notification', (req, res) => {
  const subscription = req.body.subscription;
  const payload = JSON.stringify({
    title: 'Hello!',
    body: 'You have a new message!'
  });

  webPush.sendNotification(subscription, payload)
    .then(response => res.status(200).json({ message: 'Notification sent!', response }))
    .catch(error => res.status(500).json({ error }));
});

// POST: Create a new user
app.post('/users/create', (req, res) => {
  const { fname, lname, email, contact } = req.body;
  const sql = 'INSERT INTO v_users (fname, lname, email, contact) VALUES (?, ?, ?, ?)';
  pool.query(sql, [fname, lname, email, contact], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json({ message: 'User created successfully', userId: result.insertId });
    }
  });
});

// GET: Retrieve all users
app.get('/users/all-users', (req, res) => {
  pool.query('SELECT * FROM v_users', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    }
  });
});


// Retrieve a specific user by id
app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  pool.query("SELECT * FROM v_users WHERE id = ?", [userId], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(rows);
    }
  });
});


// POST: Update user data
app.put('/users/update/:id', upload_user_photo.single('photo'), (req, res) => {
  const { fname, lname, email, contact } = req.body;
  const { id } = req.params;
  imagePath = req.file ? req.file.path : '';
  const sql = 'UPDATE v_users SET fname = ?, lname = ?, email = ?, contact = ?, photo = ? WHERE id = ?';
  pool.query(sql, [fname, lname, email, contact, imagePath, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json({ message: 'User updated successfully', affectedRows: result.affectedRows });
    }
  });
});


// POST: Create a new venue
// Using upload.single('image') to process file upload for venue image
app.post('/venues/create', upload_venue_image.single('image'), (req, res) => {
  const { name, address, capacity, pricing, description, owner } = req.body;

  // If a file was uploaded, use its path. Otherwise, use an empty string or a default image path.
  imagePath = req.file ? req.file.path : '';

  const sql = 'INSERT INTO v_venues (name, address, capacity, pricing, description, image, owner) VALUES (?, ?, ?, ?, ?, ?, ?)';
  pool.query(sql, [name, address, capacity, pricing, description, imagePath, owner], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json({ message: 'Venue created successfully', venueId: result.insertId });
    }
  });
});

// POST: Update an existing venue
app.put('/venues/update/:id', (req, res) => {
  const { name, address, capacity, pricing, description } = req.body;
  const { id } = req.params;
  const sql = 'UPDATE v_venues SET name = ?, address = ?, capacity = ?, pricing = ?, description = ? WHERE id = ?';
  pool.query(sql, [name, address, capacity, pricing, description, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json({ message: 'Venue updated successfully', affectedRows: result.affectedRows });
    }
  });
});

// GET: Retrieve all venues
app.get('/venues/all-venues', (req, res) => {
  pool.query('SELECT * FROM v_venues', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    }
  });
});

// Retrieve a specific venue by id
app.get("/venues/:id", (req, res) => {
  const venueId = req.params.id;
  pool.query("SELECT * FROM v_venues WHERE id = ?", [venueId], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(rows);
    }
  });
});

// Delete a venue by id and all associated images and events will be deleted
// Directory where images are stored
const IMAGE_DIR = path.join(__dirname);

app.delete('/venues/delete/:id', async (req, res) => {
  const venueId = parseInt(req.params.id, 10);
  if (Number.isNaN(venueId)) {
    return res.status(400).json({ error: 'Invalid venue ID' });
  }
  try {
    // 1) Get all image paths
    const [images] = await pool1.execute(
      'SELECT image FROM v_images WHERE venueId = ?', [venueId]
    );

    // 2) Delete each file via fs.promises.unlink()
    await Promise.all(images.map(async ({ image }) => {
      const filePath = path.join(IMAGE_DIR, image);
      try {
        await fs1.unlink(filePath);
      } catch (err) {
        console.warn(`Could not delete file ${filePath}: ${err.message}`);
      }
    }));

    // 3) Delete the venue (cascades to v_events & v_images)
    const [result] = await pool1.execute(
      'DELETE FROM v_venues WHERE id = ?', [venueId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    res.json({ message: 'Venue, its events, image‑rows, and files deleted' });
  } catch (err) {
    console.error('Error in delete operation:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// POST: Add image for a venue
app.post('/images/venue-image', (req, res) => {
  const { venueId } = req.body;

  const sql = 'INSERT INTO v_images (venueId, image) VALUES (?, ?)';
  pool.query(sql, [venueId, imagePath], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json({ message: 'Image added successfully', imageId: result.insertId });
    }
  });
});


// POST: Add image for a venue
// Using upload.single('image') to handle the image upload
app.post('/images/add-image', upload_venue_image.single('image'), (req, res) => {
  const { venueId } = req.body;

  // If a file is uploaded, use its path as the reference
  const image_Path = req.file ? req.file.path : '';

  const sql = 'INSERT INTO v_images (venueId, image) VALUES (?, ?)';
  pool.query(sql, [venueId, image_Path], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json({ message: 'Image added successfully', imageId: result.insertId });
    }
  });
});


// GET: Retrieve venue images
app.get("/venue-images/:id", (req, res) => {
  const venueId = req.params.id;
  pool.query("SELECT image FROM v_images WHERE venueId = ?", [venueId], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(rows);
    }
  });
});


// POST: Create a new event and notify venue owner
app.post('/events/create', async (req, res) => {
  
  const { venueId, organizer, title, description, date, venueName, ownerEmail, organizerName} = req.body;
  try {
    // 1. Insert the new event into v_events
    const sql = 'INSERT INTO v_events (venueId, organizer, title, description, date) VALUES (?, ?, ?, ?, ?)';
    pool.query(sql, [venueId, organizer, title, description, date], async (err, insertResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
   
    // 2. Send notification email to the venue owner
    await sendVenueOwnerEmail(ownerEmail, {title, date, venueName, createdBy: organizerName,}); // sendMail returns a promise :contentReference[oaicite:5]{index=5}

    // 3. Respond to the client
    res
      .status(201)
      .json({ message: 'Event created and owner notified', eventId: insertResult.insertId });
    });
  } catch (error) {
    console.error('Error creating event or sending email:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Retrieve all events in the system
app.get("/events", (req, res) => {
  pool.query("SELECT * FROM v_events", (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(rows);
    }
  });
});


// Retrieve a specific venue by id
app.get("/events/:id", (req, res) => {
  const venueId = req.params.id;
  pool.query("SELECT * FROM v_events WHERE venueId = ?", [venueId], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(rows);
    }
  });
});


// Retrieve all events created by a given user
app.get("/user/events/:userId", (req, res) => {
  const userId = req.params.userId;
  pool.query("SELECT * FROM v_events WHERE organizer = ?", [userId], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(rows);
    }
  });
});


// deleting an event by eventId
app.delete('/events/delete/:eventId', (req, res) => {
  const eventId = req.params.eventId;
  pool.query('DELETE FROM v_events WHERE id = ?', [eventId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Event not found' });
    } else {
      res.json({ message: 'Event deleted successfully' });
    }
  });
});








// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
