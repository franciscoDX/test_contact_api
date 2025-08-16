const { pool } = require('../config/database');

class Contact {
  static async findAll() {
    const [rows] = await pool.execute('SELECT * FROM contacts ORDER BY name');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM contacts WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async create(contactData) {
    const { name, contact, email, picture } = contactData;
    const [result] = await pool.execute(
      'INSERT INTO contacts (name, contact, email, picture) VALUES (?, ?, ?, ?)',
      [name, contact, email, picture]
    );
    
    return this.findById(result.insertId);
  }

  static async update(id, contactData) {
    const { name, contact, email, picture } = contactData;
    await pool.execute(
      'UPDATE contacts SET name = ?, contact = ?, email = ?, picture = ? WHERE id = ?',
      [name, contact, email, picture, id]
    );
    
    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM contacts WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async existsByContact(contact, excludeId = null) {
    let query = 'SELECT id FROM contacts WHERE contact = ?';
    let params = [contact];
    
    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }
    
    const [rows] = await pool.execute(query, params);
    return rows.length > 0;
  }

  static async existsByEmail(email, excludeId = null) {
    let query = 'SELECT id FROM contacts WHERE email = ?';
    let params = [email];
    
    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }
    
    const [rows] = await pool.execute(query, params);
    return rows.length > 0;
  }
}

module.exports = Contact;