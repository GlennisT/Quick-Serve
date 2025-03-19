const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./product'); // Assuming you have a Product model

const Cart = sequelize.define('Cart', {
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    businessOwnerId: {  // Each cart belongs to a business
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0, // Ensures initial price is 0
    },
}, {
    hooks: {
        beforeSave: async (cart) => {
            // Fetch all cart items linked to this cart
            const cartItems = await cart.getCartItems();
            let total = 0;

            for (const item of cartItems) {
                const product = await Product.findByPk(item.productId);
                if (product) {
                    total += product.price * item.quantity;
                }
            }

            cart.totalPrice = total;
        }
    }
});

// Associations
Cart.associate = (models) => {
    Cart.belongsTo(models.Customer, { foreignKey: 'customerId' });
    Cart.belongsTo(models.BusinessOwner, { foreignKey: 'businessOwnerId' });
    Cart.hasMany(models.CartItem, { foreignKey: 'cartId', onDelete: 'CASCADE' });
};

module.exports = Cart;
