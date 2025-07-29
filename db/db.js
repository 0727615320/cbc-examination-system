const sslOptions = process.env.DB_SSL === 'true' ? {
  ssl: {
    ca: process.env.MYSQL_CA_PEM
  }
} : {};

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ...sslOptions
});
