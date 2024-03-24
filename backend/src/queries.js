const Pool = require("pg").Pool;

const pool = new Pool({
  user: "myuser",
  host: "db",
  database: "host",
  password: "mypassword",
  port: 5400,
});

const getCovers = async (request, response) => {
  const coverType = request.query.type ?? 'smart_contract';
  console.log(coverType);
  try {
    const resp = await pool.query(
      "SELECT * FROM covers WHERE cover_type = $1",
      [coverType]
    );
    response.status(200).json({
      covers: resp.rows,
    });
  } catch (error) {
    response.status(500);
  }
};

module.exports = {
  getCovers,
};
