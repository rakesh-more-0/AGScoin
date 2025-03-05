require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MySQL Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL database");
    }
});

// API to Register User
app.post("/register", (req, res) => {
    const { wallet_address, referrer } = req.body;

    // Check if user already exists
    db.query(
        "SELECT * FROM users WHERE wallet_address = ?",
        [wallet_address],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            if (results.length > 0) {
                return res.status(400).json({ message: "User already registered!" });
            }

            // Insert new user
            db.query(
                "INSERT INTO users (wallet_address, referrer) VALUES (?, ?)",
                [wallet_address, referrer || null],
                (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });

                    res.status(200).json({ message: "Registration successful!", userId: result.insertId });
                }
            );
        }
    );
});

app.post("/api/stake", (req, res) => {
    const { user_address, stake_amount, transaction_hash } = req.body;
  
    if (!user_address || !stake_amount || !transaction_hash) {
      console.error("Missing parameters:", req.body);
      return res.status(400).json({ error: "All fields are required." });
    }

    const sql = "INSERT INTO staking_transactions (user_address, stake_amount, transaction_hash) VALUES (?, ?, ?)";

    db.query(sql, [user_address, stake_amount, transaction_hash], (err, result) => {
      if (err) {
        console.error("❌ Database Insert Error:", err);
        return res.status(500).json({ error: "Database error", details: err.message });
      }
      console.log("✅ Staking data stored successfully:", result);
      res.status(200).json({ message: "Staking data stored successfully." });
    });
});


app.get("/getUserData/:wallet", (req, res) => {
    const wallet = req.params.wallet;
    const query = "SELECT * FROM users WHERE wallet_address = ?";
  
    db.query(query, [wallet], (err, result) => {
      if (err) {
        res.status(500).json({ error: "Database query failed" });
      } else {
        res.json(result.length > 0 ? result[0] : {});
      }
    });
  });

  
  // API Route to Get Staking Data
  app.get("/getStakingData/:wallet", (req, res) => {
    const wallet = req.params.wallet;
    const query = "SELECT id, user_address, stake_amount, transaction_hash, timestamp FROM staking_transactions WHERE user_address = ?";

    db.query(query, [wallet], (err, result) => {
        if (err) {
            console.error("Database query failed:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "No staking data found" });
        }
        res.json(result);
    });
});

  // API Route to Get Level Staking Data
  app.get("/getLevelStakingData/:wallet", (req, res) => {
    const wallet = req.params.wallet;
    console.log("Received Wallet:", wallet); // Debugging Log

    const query = `
        SELECT SUM(amount) as totalamount, 
  COUNT(user_address) as totalcount 
  FROM e_wallet_history where
   user_address= ? 
   GROUP by level;
    `;

    db.query(query, [wallet], (err, result) => {
        if (err) {
            console.error("Database query failed:", err);
            return res.status(500).json({ error: "Database query failed" });
        }

        console.log("Query Result:", result); // Debugging Log

        if (result.length === 0) {
            return res.status(404).json({ message: "No level staking data found" });
        }
        
        res.json(result);
    });
});

app.get("/getReStakingData/:wallet", (req, res) => {
    const wallet = req.params.wallet;
    console.log("Received Wallet:", wallet); // Debugging Log

    const query = `
       SELECT SUM(stake_amount)as stakeAmount , COUNT(user_address)as stakeCount FROM re_staking_transactions where user_address= ?;
    `;

    db.query(query, [wallet], (err, result) => {
        if (err) {
            console.error("Database query failed:", err);
            return res.status(500).json({ error: "Database query failed" });
        }

        console.log("Query Result:", result); // Debugging Log

        if (result.length === 0) {
            return res.status(404).json({ message: "No level staking data found" });
        }
        
        res.json(result);
    });
});

app.get("/getLevelEarningData/:wallet", (req, res) => {
    const wallet = req.params.wallet;
    console.log("Received Wallet:", wallet); // Debugging Log

    const query = `
      SELECT SUM(amount) as levelearning , COUNT(user_address) as levelcount FROM e_wallet_history where user_address = ?;
    `;

    db.query(query, [wallet], (err, result) => {
        if (err) {
            console.error("Database query failed:", err);
            return res.status(500).json({ error: "Database query failed" });
        }

        console.log("Query Result:", result); // Debugging Log

        if (result.length === 0) {
            return res.status(404).json({ message: "No level staking data found" });
        }
        
        res.json(result);
    });
});


app.get("/getLevelReStakingData/:wallet", (req, res) => {
    const wallet = req.params.wallet;
    const query = "SELECT id, user_address, stake_amount, transaction_hash, timestamp FROM re_staking_transactions WHERE user_address = ?";

    db.query(query, [wallet], (err, result) => {
        if (err) {
            console.error("Database query failed:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "No staking data found" });
        }
        res.json(result);
    });
});


// Start Server
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
