import { Pool, QueryResult } from 'pg'

const defConfig = {
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT),
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
}

const railwayConfig = {
    user: process.env.PGUSERRAILWAY,
    database: process.env.PGDATABASERAILWAY,
    host: process.env.PGHOSTRAILWAY,
    password: process.env.PGPASSWORDRAILWAY,
    port: Number(process.env.PGPORTRAILWAY),

}

const pool = new Pool(process.env.ENV === 'DEV' ? defConfig : railwayConfig)

export const query = async (text: string, params?: any[]): Promise<QueryResult> => {
    const client = await pool.connect()
    try {
        return await client.query(text, params)
    } finally {
        client.release 
    }
}