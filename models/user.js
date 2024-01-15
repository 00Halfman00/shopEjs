const { getDb } = require('../utils/database');

class User {
  constructor(firstName, lastName, email) {
    (this.firstName = firstName),
      (this.lastName = lastName),
      (this.email = email);
  }

  save() {
    const db = getDb();
    return db
      .collection('users')
      .insertOne(this)
      .then((user) => console.log(user))
      .catch((err) => console.log(err));
  }

}

module.exports = User;
