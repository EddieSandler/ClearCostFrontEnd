const express = require('express');
const router = express.Router();
const db = require('../db');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { authenticateToken, checkAdmin } = require('../middleWare/auth.js');

router.use(cors());

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query(`SELECT * FROM users where username = $1`, [username]);
    if (result.rows.length === 0) {
      return res.status(400).send('User not found');
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).send('Invalid Credentials');
    }

    const token = jwt.sign({
      id: user.id,
      username: user.username,
      insuranceCompany: user.insurance_company,
      copayment: user.copayment,
      coinsurance: user.coinsurance,
      deductible: user.deductible,
      isAdmin: user.isAdmin
    }, SECRET_KEY, { expiresIn: '1h' });

    console.log('login successful, token:', token);
    return res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).send('Error logging in');
  }
});

router.post('/register', async (req, res) => {
  const { username, password, insuranceCompany, copayment, coinsurance, deductible,isAdmin } = req.body;
  try {
    const password_hash = await bcrypt.hash(password, 10); // Hash the password
    const result = await db.query(
      'INSERT INTO users (username, password_hash, insurance_company, copayment, coinsurance, deductible, "isAdmin") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [username, password_hash, insuranceCompany, copayment, coinsurance, deductible, isAdmin ]
    );

    res.status(200).send(result.rows[0]);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).send('Error registering user');
  }
});

// Apply authenticateToken middleware to all routes below this line
router.use(authenticateToken);





router.get('/compare', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { procedureId } = req.query;
  console.log('Comparison endpoint works Dude!');

  if (!procedureId || isNaN(parseInt(procedureId))) {
    return res.status(400).json({ error: "Invalid or missing procedureId" });
  }

  const procedureIdInt = parseInt(procedureId);
  console.log(`Querying for procedureId: ${procedureIdInt}`);

  try {
    const result = await db.query(`
      SELECT
        procedures.procedure_name,
        facilities.facility_name,
        pricing.price
      FROM
        pricing
      JOIN
        facilities ON pricing.facility_id = facilities.id
      JOIN
        procedures ON pricing.procedure_id = procedures.id
      WHERE
        procedures.id = $1;
    `, [procedureIdInt]);

    console.log(`Query result: ${JSON.stringify(result.rows)}`);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No data found for the given procedureId and facilityId" });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post('/save-comparison', async (req, res) => {
  const { comparison } = req.body;
  const userId = req.user.id;

  try {
    const result = await db.query(`
      UPDATE users SET saved_comparisons = COALESCE(saved_comparisons, '[]'::jsonb) || $1::jsonb WHERE id = $2 RETURNING *`,
      [JSON.stringify(comparison), userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: 'Comparison saved successfully', user: result.rows[0] });
  } catch (err) {
    console.error('Error saving comparison:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/get-comparisons', async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      'SELECT saved_comparisons FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ comparisons: result.rows[0].saved_comparisons });
  } catch (err) {
    console.error('Error retrieving comparisons:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/delete-all-comparisons', async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      'UPDATE users SET saved_comparisons = \'[]\'::jsonb WHERE id = $1 RETURNING *',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found or no comparisons to delete' });
    }

    res.json({ message: 'All comparisons deleted successfully', user: result.rows[0] });
  } catch (err) {
    console.error('Error deleting all comparisons:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/update-profile', authenticateToken, async (req, res) => {
  const { insuranceCompany, copayment, coinsurance } = req.body;
  const userId = req.user.id;

  try {
    const result = await db.query(
      'UPDATE users SET insurance_company = $1, copayment = $2, coinsurance = $3 WHERE id = $4 RETURNING *',
      [insuranceCompany, copayment, coinsurance, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user: result.rows[0] });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//the following endpoints are restricted to admin users.


router.post('/admin',authenticateToken, checkAdmin, async (req, res, next) => {

  try {
    const token = req.body.token;
    const data = jwt.verify(token, SECRET_KEY);
    return res.json({ msg: "Signed In as admin" });
  } catch (e) {
    return next(e);
  }
});

//admins can add procedures,facilities,and prices
router.post('/add-procedure', authenticateToken, checkAdmin, async (req, res) => {
  const { cpt_code, procedure_name, facility_name, price } = req.body;

  try {
    // Add or retrieve procedure
    const procedureResult = await db.query(
      `INSERT INTO procedures (cpt_code, procedure_name)
       VALUES ($1, $2)
       ON CONFLICT (cpt_code, procedure_name) DO UPDATE
       SET procedure_name = EXCLUDED.procedure_name
       RETURNING id`,
      [cpt_code, procedure_name]
    );
    const procedureId = procedureResult.rows[0].id;

    // Add or retrieve facility
    const facilityResult = await db.query(
      `INSERT INTO facilities (facility_name)
       VALUES ($1)
       ON CONFLICT (facility_name) DO UPDATE
       SET facility_name = EXCLUDED.facility_name
       RETURNING id`,
      [facility_name]
    );
    const facilityId = facilityResult.rows[0].id;

    // Add pricing
    const pricingResult = await db.query(
      `INSERT INTO pricing (procedure_id, facility_id, price)
       VALUES ($1, $2, $3)
       ON CONFLICT (procedure_id, facility_id) DO UPDATE
       SET price = EXCLUDED.price
       RETURNING *`,
      [procedureId, facilityId, price]
    );

    res.status(201).json({ procedure: procedureResult.rows[0], facility: facilityResult.rows[0], pricing: pricingResult.rows[0] });
  } catch (error) {
    console.error('Error adding procedure, facility, and pricing:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//endpoint to dynamically fetch all procedures when  front end pricecomparison form mounts
router.get('/procedures', async (req, res) => {
  try {
    const result = await db.query('SELECT id, procedure_name FROM procedures');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching procedures:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});






module.exports = router;
