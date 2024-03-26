import { Pool, QueryResult } from 'pg'

const devConfig = {
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT),
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    max: Infinity,
}

// const railwayConfig = {
//     user: process.env.PGUSERRFL0,
//     database: process.env.PGDATABASEFL0,
//     host: process.env.PGHOSTFL0,
//     password: process.env.PGPASSWORDFL0,
//     port: Number(process.env.PGPORTFL0),
// }

const vercelPG = {
    connectionString: `${process.env.VERCEL_CONNECTION_STRING}`,
}

const pool = new Pool(process.env.ENV === 'DEV' ? devConfig : vercelPG)

export const query = async (text: string, params?: any[]): Promise<QueryResult> => {
    const client = await pool.connect()
    try {
        return await client.query(text, params)
    }  catch (err) {
        console.error('Error executing query:', err);
        throw err; 
    }  finally {
        client.release 
    }
}