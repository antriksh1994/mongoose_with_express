const mongoose = require('mongoose')
const { Schema } = mongoose
const Product = require('./product')

const farmSchema = new Schema({
    name: String,
    city: String,
    products: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]
})
// mongoose middleware is different from express middleware, this function is from mongoose
farmSchema.post('findOneAndDelete', async (farm) => {
    console.log('==post==middleware==', farm)
    if (farm.products.length) {
        const res= await Product.deleteMany({_id: { $in: farm.products }})
        console.log('==15==res', res)
    }
})
const Farm = mongoose.model('Farm', farmSchema)
module.exports = Farm;