import mongoose, { Model, model, Schema } from 'mongoose';
import { IProduct } from '../interfaces';

const prodcutSchema = new Schema({
    description: { type: String, require: true },
    images: [{ type: String }],
    inStock: { type: Number, require: true, default: 0 },
    price: { type: Number, require: true, default: 0 },
    sizes: [{
        type: String,
        enum: {
            values: ['XS','S','M','L','XL','XXL','XXXL'],
            message: '{VALUE} no es un tamaño válido.'
        }
    }],
    slug: { type: String, require: true, unique: true },
    tags: [{ type: String }],
    title: { type: String, require: true, unique: true },
    type: {
        type: String,
        enum: {
            values: ['shirts','pants','hoodies','hats'],
            message: '{VALUE} no es un tipo válido.'
        }
    },
    gender: {
        type: String,
        enum: {
            values: ['men','women','kid','unisex'],
            message: '{VALUE} no es un género válido.'
        }
    },
}, { timestamps: true });

prodcutSchema.index({ title: 'text', tags: 'text'});

const Product: Model<IProduct> = mongoose.models.Product || model('Product', prodcutSchema);

export default Product;