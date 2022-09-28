//by using this(inndex.js) file we can assess secrets
import dotenv from 'dotenv'
dotenv.config();
//by writing above two lines,variable of.env file come in to process.env  

export const { APP_PORT, DEBUG_MODE, DB_URL, JWT_SECRET, REFRESH_SECRET, APP_URL } = process.env;

