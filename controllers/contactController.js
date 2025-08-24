const Contact = require('../models/Contact');
const { validateContact } = require('../utils/validation');
const fs = require('fs');
const path = require('path');

class ContactController {
  // GET /contacts - List all contacts
  static async getAllContacts(req, res) {
    try {
      const contacts = await Contact.findAll();
      res.json(contacts);
    } catch (error) {
      console.error('Error getting contacts:', error);
      res.status(500).json({ error: 'Internal Error' });
    }
  }

  // GET /contacts/:id - Get contact by ID
  static async getContactById(req, res) {
    try {
      const { id } = req.params;
      
      if (!/^\d+$/.test(id)) {
        return res.status(400).json({ error: 'The ID must be a valid number' });
      }
      
      const contact = await Contact.findById(id);
      
      if (!contact) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      
      res.json(contact);
    } catch (error) {
      console.error('Error getting contact:', error);
      res.status(500).json({ error: 'Internal Error' });
    }
  }

  // POST /contacts - Create new contact
  static async createContact(req, res) {
    try {
      const { name, contact, email } = req.body;
      
      // Validate if the request has a file image
      if (!req.file) {
        return res.status(400).json({ error: 'the request must contain a file image' });
      }
      
      // validate basic contact data
      const validationErrors = validateContact({ name, contact, email });
      if (validationErrors.length > 0) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ errors: validationErrors });
      }
      
      // validate uniqueness of contact and email
      const contactExists = await Contact.existsByContact(contact);
      if (contactExists) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'Already exists that number' });
      }
      
      const emailExists = await Contact.existsByEmail(email);
      if (emailExists) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'Already exists that email' });
      }
      
      const picture = `uploads/${req.file.filename}`;
      
      const newContact = await Contact.create({
        name: name.trim(),
        contact,
        email: email.toLowerCase().trim(),
        picture
      });
      
      res.status(201).json(newContact);
    } catch (error) {
      //delete the uploaded file if there was an error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      console.error('Error creating contact:', error);
      res.status(500).json({ error: 'Internal Error' });
    }
  }

  // PUT /contacts/:id - Update contact
  static async updateContact(req, res) {
    try {
      const { id } = req.params;
      const { name, contact, email } = req.body;
      
      if (!/^\d+$/.test(id)) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'The ID must be a valid number' });
      }
      
      // Validate if the id exists
      const existingContact = await Contact.findById(id);
      if (!existingContact) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(404).json({ error: 'Contact not found' });
      }
      
      const validationErrors = validateContact({ name, contact, email });
      if (validationErrors.length > 0) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ errors: validationErrors });
      }
      
      // validate uniqueness of contact excluding the current contact
      const contactExists = await Contact.existsByContact(contact, id);
      if (contactExists) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'Already exists that number' });
      }
      
      // validate uniqueness of email
      const emailExists = await Contact.existsByEmail(email, id);
      if (emailExists) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'Already exists that email' });
      }
      
      let picture = existingContact.picture;
      
      // if a new file was uploaded, delete the old one and set the new picture path
      if (req.file) {
        const oldPicturePath = path.join(__dirname, '..', existingContact.picture);
        if (fs.existsSync(oldPicturePath)) {
          fs.unlinkSync(oldPicturePath);
        }
        picture = `uploads/${req.file.filename}`;
      }
      
      const updatedContact = await Contact.update(id, {
        name: name.trim(),
        contact,
        email: email.toLowerCase().trim(),
        picture
      });
      
      res.json(updatedContact);
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      console.error('Error updating contact:', error);
      res.status(500).json({ error: 'Internal Error' });
    }
  }

  // DELETE /contacts/:id - Delete contact
  static async deleteContact(req, res) {
    try {
      const { id } = req.params;
      
      if (!/^\d+$/.test(id)) {
        return res.status(400).json({ error: 'the ID must be a valid number' });
      }
      
      // get existing contact to check if it exists
      const existingContact = await Contact.findById(id);
      if (!existingContact) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      
      // delete the contact from the database
      const deleted = await Contact.delete(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      
      // delete the picture file if it exists
      const picturePath = path.join(__dirname, '..', existingContact.picture);
      if (fs.existsSync(picturePath)) {
        fs.unlinkSync(picturePath);
      }
      
      res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
      console.error('Error deleting contact:', error);
      res.status(500).json({ error: 'Internal Error' });
    }
  }
}

module.exports = ContactController;