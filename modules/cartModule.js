import mongoose from "mongoose";
const cartSchema =  mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'customerRegData',
    required: true,
    unique:true
  },
  products: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sellingDogs', 
        required: true
      }
    }
  ]
});

const Cart = mongoose.model('Cart', cartSchema);
export {Cart};