const express = require('express');
const ContactController = require('../controllers/contactController');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', ContactController.getAllContacts);
router.get('/:id', ContactController.getContactById);
router.post('/', upload.single('picture'), ContactController.createContact);
router.put('/:id', upload.single('picture'), ContactController.updateContact);
router.delete('/:id', ContactController.deleteContact);

module.exports = router;