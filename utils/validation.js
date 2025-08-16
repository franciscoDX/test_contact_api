function validateContact(data) {
  const errors = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 5) {
    errors.push('the name must be a string with at least 5 characters');
  }
  
  if (!data.contact || !/^\d{9}$/.test(data.contact)) {
    errors.push('the contact must be a string of exactly 9 digits');
  }
  
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('the email must be a valid email address');
  }
  
  return errors;
}

module.exports = { validateContact };