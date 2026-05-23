import express from 'express'
import db from '../db.ts'
import path from 'path'
import fs from 'fs'

const CAMERA_API = 'http://10.171.45.220'
const router = express.Router()
const FACE_FOLDER = path.join(process.cwd(), "src","face")

router.get("/camera" ,async(req, res) => {
    let conn
    try {
        conn = await db.getConnection()
        const [result] = await conn.query(`SELECT * FROM face_data
                                           ORDER BY face_id ASC
                                           LIMIT 1 `);
        res.status(200).json(result)
    }

    catch(dbErr) {
        console.error("Can not fetch data", dbErr)
        res.status(500).json({
            message: "Internal server error"
        })
    }
    finally {
        if (conn)
            conn.release()
    }
})


router.post("/camera", async(req, res) => {
    let conn 
    try {
        conn = await db.getConnection()
        const {status} = req.body

        const response = await fetch(`${CAMERA_API}/latest.jpg`)
        if (!response.ok) {
            return res.status(500).json({
                message: "Can not fetch the image"
            })
        }

        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const filename = `${Date.now()}.jpg`

        //luu anh vao src/face
        const savePath = path.join(
            FACE_FOLDER,
            filename
            )
        fs.writeFileSync(savePath, filename)
        const imgPath = `/face/${filename}`

        await conn.query(`INSERT INTO face_data(image_url, status, created_at) 
                            VALUES(?,?,NOW())`,[filename, status])
        res.status(200).json({
            message: "Internal server error",
            image: imgPath
        })

    }
    catch(err) {
        console.log(err)
        res.status(500).json({
            message: "Failed to fetch"
        })
    }
    
    finally {
        if (conn) {
            conn.release()
        }
    }
})

router.delete("/camera", async(req, res) => {
    let conn;
    try {
        conn = await db.getConnection()
        await conn.query(`TRUNCATE TABLE face_data`)
        res.status(200).json({
            message: "Delete successfully"
        })
    }
    catch(dbErr) {
        console.error("Cannot delete database", dbErr)
        res.status(500).json({
            message: "Failed to delete"
        })
    }

    finally{
        if (conn) conn.release()
    }
})

export default router;