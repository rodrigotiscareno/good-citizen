import mysql from "mysql";
import fetch from "node-fetch";
import express, { response } from "express";
import path from "path";
import bodyParser from "body-parser";
import services from "./services/";
const config = require("./config");
const app = express();
const port = process.env.PORT || 5001;

app.use(bodyParser.json({ limit: "50mb" }));

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.static(path.join(__dirname, "../../../../client/build")));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/services", services);

app.post("/api/addEvent", (req, res) => {
  let connection = mysql.createConnection(config);
  var transactionErrors = 0;

  connection.query(`START TRANSACTION`, [], (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    connection.query(
      `INSERT INTO ctiscare.events
		(title,
		date_start,
		date_end,
		description,
		location,
		centre_lat,
		centre_long,
		invite_criteria,
		status,
		neighborhood_id,
		host_user_id)
		VALUES
		(
			?,
			?,
			?,
			?,
			?,
			?,
			?,
			?,
			?,
			?,
			?
		);`,
      [
        req.body.eventName,
        req.body.eventStartTime,
        req.body.eventEndTime,
        req.body.eventDescription,
        req.body.eventLocation,
        req.body.eventLat,
        req.body.eventLong,
        req.body.criteria,
        "Active",
        1,
        req.body.hostUserID,
      ],
      (error, results, fields) => {
        if (error) {
          transactionErrors = transactionErrors + 1;
          return console.error(error.message);
        }
        if (transactionErrors > 0) {
          connection.query(`ROLLBACK`, [], (error, results, fields) => {
            connection.end();
          });
        } else {
          connection.query(`COMMIT`, [], (error, results, fields) => {
            connection.end();
          });
        }
      }
    );
  });
});

app.post("/api/addNotice", (req, res) => {
  let connection = mysql.createConnection(config);
  var transactionErrors = 0;

  connection.query(`START TRANSACTION`, [], (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    connection.query(
      `INSERT INTO ctiscare.notices
    (
      title,
      type,
      date_start,
      date_end,
      description,
      icon,
      location,
      centre_lat,
      centre_long,
      status,
      neighborhood_id,
      host_user_id
    )
    VALUES
    (
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?
    );`,
      [
        req.body.noticeName,
        req.body.type,
        req.body.noticeStartTime,
        req.body.noticeEndTime,
        req.body.noticeDescription,
        req.body.icon,
        req.body.noticeLocation,
        req.body.noticeLat,
        req.body.noticeLong,
        "Active",
        1,
        req.body.hostUserID,
      ],
      (error, results, fields) => {
        if (error) {
          transactionErrors = transactionErrors + 1;
          return console.error(error.message);
        }
        if (transactionErrors > 0) {
          connection.query(`ROLLBACK`, [], (error, results, fields) => {
            connection.end();
          });
        } else {
          connection.query(`COMMIT`, [], (error, results, fields) => {
            connection.end();
          });
        }
      }
    );
  });
});

app.post("/api/signup", (req, res) => {
  let connection = mysql.createConnection(config);

  let data = [
    req.body.email,
    req.body.password,
    Date.now().toString(),
    "active",
    req.body.firstName,
    req.body.lastName,
    req.body.postalCode,
    req.body.neighborhood_id,
    req.body.interests,
    req.body.businessName,
    req.body.businessType,
    req.body.party,
    req.body.position,
    req.body.userType,
  ];

  let sql = `INSERT INTO users (
    email,
    password_hash,
    created_on,
    status,
    first_name,
    last_name,
    postal_code,
    neighborhood_id,
    interests,
    business_name,
    business_type,
    party,
    position,
    user_type
    ) VALUES (
    ?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;

  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }

    let string = JSON.stringify(results);
    res.send({ response: string });
  });
  connection.end();
});

app.post("/api/signin", (req, res) => {
  let connection = mysql.createConnection(config);

  let sql = `SELECT * FROM users WHERE email = ? AND password_hash = ? AND status = ?`;

  let data = [req.body.email, req.body.password, "active"];

  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }

    let string = JSON.stringify(results);
    res.send({ response: string });
  });
  connection.end();
});

app.post("/api/deleteUser", (req, res) => {
  let connection = mysql.createConnection(config);

  let sql = `UPDATE users
	SET status='delete-requested'
	WHERE user_id= ? ;`;

  connection.query(sql, [req.body.userId], (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }

    let string = JSON.stringify(results);
    res.send({ response: string });
  });
  connection.end();
});

app.post("/api/getPosts", (req, res) => {
  let connection = mysql.createConnection(config);

  const sql = `
  SELECT feed_posts.*, users.first_name, users.last_name, users.neighborhood_id
  FROM feed_posts
    JOIN users ON feed_posts.user_id = users.user_id
  WHERE users.neighborhood_id = ? AND feed_posts.status = ? ORDER BY feed_posts.feed_id DESC;`;

  connection.query(
    sql,
    [req.body.neighborhoodId, "published"],
    (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      let string = JSON.stringify(results);
      res.send({ response: string });
    }
  );
  connection.end();
});

app.post("/api/getComments", (req, res) => {
  let connection = mysql.createConnection(config);

  const sql = `
  SELECT feed_comments.content, feed_comments.created_on, feed_comments.user_id, feed_comments.feed_id, users.first_name
  FROM feed_comments
    JOIN users ON feed_comments.user_id = users.user_id
  WHERE feed_comments.status = ? ORDER BY feed_comments.feed_id DESC;`;

  connection.query(sql, ["published"], (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    let string = JSON.stringify(results);
    res.send({ response: string });
  });
  connection.end();
});

app.post("/api/flagPost", (req, res) => {
  let connection = mysql.createConnection(config);

  const sql = `UPDATE feed_posts SET status = ? WHERE feed_id = ?`;

  connection.query(
    sql,
    ["flagged", req.body.feedId],
    (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      let string = JSON.stringify(results);
      res.send({ response: string });
    }
  );
  connection.end();
});

app.post("/api/flagVoice", (req, res) => {
  let connection = mysql.createConnection(config);

  const sql = `UPDATE voice SET status = ? WHERE voice_id = ?`;

  connection.query(
    sql,
    ["flagged", req.body.voiceId],
    (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      let string = JSON.stringify(results);
      res.send({ response: string });
    }
  );
  connection.end();
});

app.post("/api/addPost", (req, res) => {
  let connection = mysql.createConnection(config);

  const sql = `INSERT INTO feed_posts (user_id, content, status, neighborhood_id, created_on) VALUES (?, ?, ?, ?, ?)`;

  connection.query(
    sql,
    [
      req.body.userId,
      req.body.content,
      "published",
      req.body.neighborhoodId,
      Date.now(),
    ],
    (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      let string = JSON.stringify(results);
      res.send({ response: string });
    }
  );
  connection.end();
});

app.post("/api/resharePost", (req, res) => {
  let connection = mysql.createConnection(config);

  const sql = `INSERT INTO feed_posts (user_id, content, status, neighborhood_id, parent_feed_id) VALUES (?, ?, ?, ?, ?)`;

  connection.query(
    sql,
    [
      req.body.userId,
      req.body.content,
      "published",
      req.body.neighborhoodId,
      req.body.parentFeedId,
    ],
    (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      let string = JSON.stringify(results);
      res.send({ response: string });
    }
  );
  connection.end();
});

app.post("/api/deletePost", (req, res) => {
  let connection = mysql.createConnection(config);

  const sql = `UPDATE feed_posts SET status = ? WHERE feed_id = ?`;
  connection.query(
    sql,
    ["deleted", req.body.feedId],
    (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      let string = JSON.stringify(results);
      res.send({ response: string });
    }
  );
  connection.end();
});

app.post("/api/editPost", (req, res) => {
  let connection = mysql.createConnection(config);

  const sql = `UPDATE feed_posts SET content = ? WHERE feed_id = ?`;
  connection.query(
    sql,
    [req.body.content, req.body.feedId],
    (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      let string = JSON.stringify(results);
      res.send({ response: string });
    }
  );
  connection.end();
});

app.post("/api/addComment", (req, res) => {
  let connection = mysql.createConnection(config);

  const sql = `INSERT INTO feed_comments (feed_id, user_id, created_on, content, status) VALUES (?, ?, ?, ?, ?)`;
  connection.query(
    sql,
    [
      req.body.feedId,
      req.body.userId,
      Date.now(),
      req.body.content,
      "published",
    ],
    (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      let string = JSON.stringify(results);
      res.send({ response: string });
    }
  );

  connection.end();
});

app.post("/api/loadEvents", (req, res) => {
  let connection = mysql.createConnection(config);
  let sql = `SELECT
  event_id,
  title,
  CAST(date_start as CHAR) as date_start,
  CAST(date_end as CHAR) as date_end,
  description,
  location,
  centre_lat,
  centre_long,
  invite_criteria,
  'status',
  events.neighborhood_id,
  email,
  concat(first_name, ' ', last_name) as user_name
  FROM ctiscare.events
  JOIN users ON users.user_id = events.host_user_id
  WHERE date_end > NOW();`;
  let data = [];
  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    let string = JSON.stringify(results);
    res.send({ express: string });
  });
  connection.end();
});

app.post("/api/loadNotices", (req, res) => {
  let connection = mysql.createConnection(config);
  let sql = `SELECT
  notice_id,
  title,
  type,
  CAST(date_start as CHAR) as date_start,
  CAST(date_end as CHAR) as date_end,
  description,
  icon,
  location,
  centre_lat,
  centre_long,
  'status',
  notices.neighborhood_id,
  email,
  concat(first_name, ' ', last_name) as user_name
  FROM ctiscare.notices
  JOIN users ON users.user_id = notices.host_user_id
  WHERE date_end > NOW();`;
  let data = [];
  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    let string = JSON.stringify(results);
    res.send({ express: string });
  });
  connection.end();
});

app.post("/api/getCurrentUser", (req, res) => {
  let connection = mysql.createConnection(config);

  const sql = `SELECT * 
  FROM users 
  WHERE email = ?
  AND status = 'Active'`;
  connection.query(sql, [req.body.email], (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    let string = JSON.stringify(results);
    res.send({ response: string });
  });
  connection.end();
});

app.post("/api/deleteAccount", (req, res) => {
  let connection = mysql.createConnection(config);

  const sql = `DELETE FROM users where email=?`;
  connection.query(sql, [req.body.email], (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    let string = JSON.stringify(results);
    res.send({ response: string });
  });
  connection.end();
});

app.post("/api/getUsers", (req, res) => {
  let connection = mysql.createConnection(config);

  const sql = `
  SELECT
  user_id,
  email,
  created_on,
  first_name,
  last_name,
  postal_code,
  neighborhood_id,
  user_type,
  interests
  FROM users
  WHERE user_id <> ? 
  AND neighborhood_id = ?;`;
  connection.query(
    sql,
    [req.body.user_id, req.body.neighborhood_id],
    (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      let string = JSON.stringify(results);
      res.send({ response: string });
    }
  );
  connection.end();
});

app.post("/api/getUserFirstName", (req, res) => {
  let connection = mysql.createConnection(config);

  const sql = `
  SELECT first_name
  FROM users
  WHERE user_id = ?`;

  connection.query(sql, [req.body.user_id], (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    let string = JSON.stringify(results);
    res.send({ response: string });
  });
  connection.end();
});

app.post("/api/edit", (req, res) => {
  let connection = mysql.createConnection(config);

  let data = [
    req.body.firstName,
    req.body.lastName,
    req.body.postalCode,
    req.body.neighborhood_id,
    req.body.interests,
    req.body.businessName,
    req.body.businessType,
    req.body.party,
    req.body.position,
    req.body.userType,
    req.body.email,
  ];

  let sql = `UPDATE users SET 
  first_name = ?,
  last_name = ?,
  postal_code = ?,
  neighborhood_id = ?,
  interests = ?,
  business_name = ?,
  business_type = ?,
  party = ?,
  position = ?,
  user_type = ?
  WHERE email = ?;`;

  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }

    let string = JSON.stringify(results);
    res.send({ response: string });
  });
  connection.end();
});

app.post("/api/loadUserPosts", (req, res) => {
  let connection = mysql.createConnection(config);

  const sql = `
  SELECT feed_posts.content, feed_posts.created_on, feed_posts.feed_id
  FROM feed_posts
  WHERE feed_posts.status = ? AND user_id = ? ORDER BY feed_posts.feed_id DESC;`;

  connection.query(
    sql,
    ["published", req.body.userId],
    (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      let string = JSON.stringify(results);
      res.send({ response: string });
    }
  );
  connection.end();
});

app.post("/api/getEventInfo", (req, res) => {
  let connection = mysql.createConnection(config);

  const sql = `
  SELECT
    event_id,
    user_id,
    title,
    CAST(date_start as CHAR) as date_start,
    CAST(date_end as CHAR) as date_end,
    description,
    location,
    invite_criteria,
    email as host_email,
    concat(first_name, ' ', last_name) as host_name,
    centre_lat,
    centre_long
  FROM 
    events 
  JOIN 
    users 
  ON 
    users.user_id = events.host_user_id
  WHERE 
    event_id = ?`;

  connection.query(sql, [req.body.event_id], (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    let string = JSON.stringify(results);
    res.send({ response: string });
  });
  connection.end();
});

app.post("/api/loadUserEvents", (req, res) => {
  let connection = mysql.createConnection(config);

  const sql = `
  SELECT events.title, CAST(events.date_start as CHAR) as date_start, CAST(events.date_end as CHAR) as date_end, events.description
  FROM events
  WHERE events.status = ? AND host_user_id = ? ORDER BY events.date_start DESC;`;

  connection.query(
    sql,
    ["Active", req.body.userId],
    (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      let string = JSON.stringify(results);
      res.send({ response: string });
    }
  );
  connection.end();
});

app.post("/api/getEventAttendees", (req, res) => {
  let connection = mysql.createConnection(config);

  const sql = `
  SELECT 
    DISTINCT CONCAT(first_name, " ", last_name) as attendee_name
  FROM 
    users
  JOIN 
    event_attendees
  ON 
    event_attendees.user_id = users.user_id
  JOIN 
    events
  ON 
    event_attendees.event_id = events.event_id
  WHERE 
    events.event_id = ?`;

  connection.query(sql, [req.body.event_id], (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    let string = JSON.stringify(results);
    console.log(string);
    res.send({ response: string });
  });
  connection.end();
});

app.post("/api/loadUserNotices", (req, res) => {
  let connection = mysql.createConnection(config);

  const sql = `
  SELECT notices.title, CAST(notices.date_start as CHAR) as date_start, CAST(notices.date_end as CHAR) as date_end, notices.description
  FROM notices
  WHERE notices.status = ? AND host_user_id = ? ORDER BY notices.date_start DESC;`;

  connection.query(
    sql,
    ["Active", req.body.userId],
    (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      let string = JSON.stringify(results);
      res.send({ response: string });
    }
  );
  connection.end();
});

app.post("/api/getSimilarUsers", (req, res) => {
  let connection = mysql.createConnection(config);

  const placeholders = req.body.interests
    .map(() => "FIND_IN_SET(?, interests)")
    .join(" OR ");
  const sql = `
    SELECT 
      first_name, 
      last_name,
      email,
      CONCAT_WS(',', 
        ${req.body.interests
          .map(
            (interest) =>
              `IF(FIND_IN_SET('${interest}', interests) > 0, '${interest}', NULL)`
          )
          .join(", ")}
      ) AS shared_interests
    FROM users
    WHERE (${placeholders})
    AND user_id <> ?;
  `;

  connection.query(
    sql,
    [...req.body.interests, req.body.user_id],
    (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      let string = JSON.stringify(results);
      res.send({ response: string });
    }
  );
  connection.end();
});

app.post("/api/RSVP", (req, res) => {
  let connection = mysql.createConnection(config);

  const sql = `
  INSERT INTO 
    ctiscare.event_attendees
  (
    event_id,
    user_id
  )
  VALUES
  (?, ?);`;

  connection.query(
    sql,
    [req.body.event_id, req.body.user_id],
    (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      let string = JSON.stringify(results);
      res.send({ response: string });
    }
  );
  connection.end();
});

app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
// app.listen(port, '129.97.25.211'\); //for the deployed version, specify the IP address of the server
