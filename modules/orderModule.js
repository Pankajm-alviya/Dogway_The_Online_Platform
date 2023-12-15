import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'customerRegData',
      required: true,
    },
    products: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'sellingDogs', 
          required: true,
        }
      },
    ],
    orderDate: {
      type: Date,
      default: Date.now,
    },
    orderTotal: {
      type: Number,
      required: true,
    },
    orderTotal: {
      type: Number,
      required: true,
    },
    name: { 
      type: String,
    },
    lastName: { 
      type: String, 
    },
    mobile: {
      type: String,
    },
    pinCode: { 
      type: Number, 
    },
    address: { 
      type: String, 
    },
    state: { 
      type: String, 
    },   
    city: { 
      type: String, 
    },
    orderStatus: { 
      type: String, 
    },
    paymentMode: { 
      type: String, 
    }
  });
  
const Order = mongoose.model('Order', orderSchema);
export {Order}
