import { min } from "date-fns";
import  mongoose  from "mongoose";
const schema = mongoose.Schema;

const contactSchema = new schema(
    {
        name: {
            type: String,
            required: true,
            min: 3,
            max: 30,
        },
        email: {
            type: String,
            required: true,
            min: 3,
            max: 30,
        },
        message: {
            type: String,
            required: true,
            min: 3,
            max: 1000,
        },
        date: {
            type: Date,
            default: Date.now,
        }

    },
    {
        timestamps: true,
    }
);

const Contact = mongoose.model("Contact", contactSchema);

export { Contact };
