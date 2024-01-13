const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', { pageTitle: 'Add Product', edit: false });
};

exports.postAddProduct = async (req, res, next) => {
  const {title, image, description, price} = req.body;
  if (
    title.trim()[0] &&
    image.startsWith('http') &&
    description.trim()[0] &&
    price.trim()[0]
  ) {
    try {
      const product = new Product(title, image, description, price);
      product.save()
      res.status(201).redirect('/admin/admin-products');
    } catch (err) {
      throw new Error(err);
    }
  }
};

// exports.getEditProduct = async (req, res, next) => {
//   try {
//     // const product = await req.user.getProducts({where; {id: req.params.productId}});// returns an array(plural search)
//     const product = await Product.findOne({
//       where: {
//         [Op.and]: [
//           { id: req.params.productId },
//           { UserId: req.user.dataValues.id },
//         ],
//       },
//     });

//     res.status(200).render('admin/edit-product', {
//       pageTitle: 'Product',
//       product: product,
//       edit: true,
//     });
//   } catch (err) {
//     throw new Error(err);
//   }
// };

// exports.postEditProduct = async (req, res, next) => {
//   try {
//     const product = await Product.findOne({
//       where: {
//         [Op.and]: [
//           {id : req.body.id},
//           {UserId: req.user.dataValues.id}
//         ]
//       }
//     });
//     product.set({ ...req.body });
//     await product.save();
//     res.status(200).redirect('/admin/admin-products');
//   } catch (err) {
//     throw new Error(err);
//   }
// };

// exports.deleteProduct = async (req, res, next) => {
//   try {
//     await Product.destroy({
//       where: {
//         [Op.and]: [
//           {id: req.body.productId},
//           {UserId: req.user.dataValues.id}
//         ]
//       },
//     });
//     res.status(200).redirect('/admin/admin-products');
//   } catch (err) {
//     throw new Error(err);
//   }
// };

exports.getAdminProducts = async (req, res, next) => {
  console.log('two')
  try {

    const products = await Product.fetchAll();
    console.log('products: ', products)
    res.status(200).render('admin/products-list', {
      pageTitle: 'Admin Products',
      products: products,
      user: req.user
    });
  } catch (err) {
    throw new Error(err);
  }
};
