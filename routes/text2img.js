const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const fs = require('fs');

// GET:prompts
router.get("/", async (req, res) => {
  const db = new sqlite3.Database("mydb.db");
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(`SELECT * FROM prompts`, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    });
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.send(error);
  } finally {
    db.close();
  }
});

// POST:prompts
router.post("/create", async (req, res) => {
  const db = new sqlite3.Database("mydb.db");
  try {
    const result = await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO prompts (type, cluster, prompt, img, description, nsfw) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          req.body.type,
          req.body.cluster,
          req.body.prompt,
          req.body.img,
          req.body.description,
          req.body.nsfw,
        ],
        function (err) {
          if (err) {
            reject(err);
          }
          resolve(this.lastID);
        }
      );
    });
    res.send({ id: result });
  } catch (error) {
    console.error(error);
    res.send(error);
  } finally {
    db.close();
  }
});

// PUT:prompts
router.put("/update/:id", async (req, res) => {
  const db = new sqlite3.Database("mydb.db");
  try {
    const result = await new Promise((resolve, reject) => {
      db.run(
        `UPDATE prompts SET type = ?, cluster = ?, prompt = ?, img = ?, description = ?, nsfw = ? WHERE id = ?`,
        [
          req.body.type,
          req.body.cluster,
          req.body.prompt,
          req.body.img,
          req.body.description,
          req.body.nsfw,
          req.params.id,
        ],
        function (err) {
          if (err) {
            reject(err);
          }
          resolve(this.changes);
        }
      );
    });
    res.send({ affectedRows: result });
  } catch (error) {
    console.error(error);
    res.send(error);
  } finally {
    db.close();
  }
});

// DELETE:prompts
router.delete("/delete/:id", async (req, res) => {
  const db = new sqlite3.Database("mydb.db");
  try {
    const result = await new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM prompts WHERE id = ?`,
        [req.params.id],
        function (err) {
          if (err) {
            reject(err);
          }
          resolve(this.changes);
        }
      );
    });
    res.send({ affectedRows: result });
  } catch (error) {
    console.error(error);
    res.send(error);
  } finally {
    db.close();
  }
});

// 特定のIDのデータを取ってくる:prompts
router.get("/:id", async (req, res) => {
  const db = new sqlite3.Database('mydb.db');
  try {
    const row = await new Promise((resolve, reject) => {
      db.get(`SELECT * FROM prompts WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      });
    });
    res.send(row);
  } catch (error) {
    console.error(error);
    res.send(error);
  } finally {
    db.close();
  }
});

// idに紐付いたイメージデータの削除
router.get("/image/:id", async (req, res) => {
  const db = new sqlite3.Database('mydb.db');
  try {
    const row = await new Promise((resolve, reject) => {
      db.get(`SELECT * FROM prompts WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      });
    });
    // imgが存在してpublic/imageの中に同じ名前の画像があれば削除
    let fileExists;
    try {
      fs.accessSync(`public/images/${row.img}`, fs.constants.F_OK);
      fileExists = true;
    } catch (err) {
      fileExists = false;
    }
    if (row.img && fileExists) {
      console.log('file exists');
      fs.unlink(`public/images/${row.img}`, (err) => {
        if (err) {
            throw err;
        }
      });
    }
    res.send("画像はありません");
  } catch (error) {
    console.error(error);
    res.send(error);
  } finally {
    db.close();
  }
});




module.exports = router;
