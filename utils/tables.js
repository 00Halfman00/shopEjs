exports.products = `CREATE TABLE IF NOT EXISTS Products (id MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, image VARCHAR(255) NOT NULL, description TEXT NOT NULL, price DECIMAL(13, 2) UNSIGNED NOT NULL, quantity INT UNSIGNED NOT NULL)`;


exports.product1 = `INSERT INTO Products (title, image, description, price, quantity) VALUES ("The Hobbit", "https://cdn.pixabay.com/animation/2022/10/13/19/49/19-49-32-785_512.gif", "Little guy in the woods", 19.99, 1)`;
exports.product2 = `INSERT INTO Products (title, image, description, price, quantity) VALUES ("Time Master", "https://cdn.pixabay.com/animation/2023/04/21/22/20/22-20-01-589_512.gif", "State of the Art wrist watch", 399.89, 1)`


