import { Router } from "express";
import db from "../db";

const router = Router();

router.post('/', (req, res) => {
    const {first_name, last_name, major, email, gpa } = req.body;

    if(!first_name || !last_name || !major || !email || gpa === undefined){
        return res.status(400).json({message: 'All fields are required'})
    }

    if(typeof gpa !== 'number' || gpa<0 || gpa>4){
        return res.status(400).json({message: 'GPA must be between 0 and 4'});
    }

    const existing = db.prepare(`SELECT id FROM students WHERE email=? `).get(email);
    if(existing){
        return res.status(409).json({message: 'Email is already registered'});
    }

    const created_at = new Date().toISOString();
    const result = db.prepare(`
        INSERT INTO students(first_name, last_name, major, email, gpa, created_at)
        VALUES(?, ?, ?, ?, ?, ?)
    `).run(first_name, last_name, major, email, gpa, created_at);

    const student = db.prepare('SELECT * FROM students WHERE id=?').get(result.lastInsertRowid);
    res.status(201).json(student);
})

router.get('/', (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string || '').trim();
    const offset = (page - 1) * limit;

    const where = search ? 'WHERE first_name LIKE ? OR last_name LIKE ?': '';
    const  params = search ? [`%${search}%`, `%${search}%`]: [];
    const row = db.prepare(`SELECT COUNT(*) as total FROM students ${where}`).get(...params) as { total: number };
    const { total } = row;

    const data = db.prepare(`
        SELECT * FROM students ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?            
    `).all(...params, limit, offset);

    res.json({
        data,
        meta: {
            page,
            limit,
            total, 
            totalPages: Math.max(1, Math.ceil(total / limit))
        }
    })
})

router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const {first_name, last_name, major, email, gpa } = req.body;

    if(!first_name || !last_name || !major || !email || gpa === undefined){
        return res.status(400).json({message: 'All fields are required'})
    }

    if(typeof gpa !== 'number' || gpa<0 || gpa>4){
        return res.status(400).json({message: 'GPA must be between 0 and 4'});
    }

    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(id)
    if (!student) {
        return res.status(404).json({ message: 'Student not found' })
    }

    const existing = db.prepare(`SELECT id FROM students WHERE email=? AND id != ? `).get(email, id);
    if(existing){
        return res.status(409).json({message: 'Email is already registered'});
    }

    db.prepare(`
        UPDATE students
        SET first_name = ?, last_name = ?, major = ?, email = ?, gpa = ?
        WHERE id = ?
    `).run(first_name, last_name, major, email, gpa, id);

    const updated = db.prepare('SELECT * FROM students WHERE id = ?').get(id);
    res.json(updated);
})

router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);

    const result = db.prepare(`
        DELETE FROM students WHERE id = ?    
    `).run(id);
    
    if(result.changes === 0){
        return res.status(404).json({message: 'Student not found'});
    }

    res.json({message: 'Student deleted successfully'});
})

export default router;