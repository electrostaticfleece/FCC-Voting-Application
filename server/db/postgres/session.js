import session from 'express-session';
import pg from 'pg';
import connectPostgres from 'connect-pg-simple';

const db = process.env.DATABASE_URL; 
const PGStore = connectPostgres(session);

export default () => 
  new PGStore(
    {
      pg,
      conString: db
    }
  );