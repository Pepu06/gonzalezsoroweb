import mongoose from 'mongoose';

// db_connection.js

let Department;
let Message;

// Initialize models only if they haven't been initialized
if (mongoose.models.Department) {
    Department = mongoose.model('Department');
} else {
    const departmentSchema = new mongoose.Schema({
        address: { type: String, required: true },
        messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
    });
    Department = mongoose.model('Department', departmentSchema);
}

if (mongoose.models.Message) {
    Message = mongoose.model('Message');
} else {
    const messageSchema = new mongoose.Schema({
        date: { type: Date, default: Date.now },
        text: { type: String, required: true },
        image: { type: String },
        department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true }
    });
    Message = mongoose.model('Message', messageSchema);
}

// Function to connect to MongoDB
async function connectDB() {
    if (mongoose.connection.readyState === 1) {
        return; // If already connected, don't connect again
    }
    try {
        await mongoose.connect('mongodb+srv://pedrogonzalezsoro:Pepu06112006@nutria.ebznb.mongodb.net/?retryWrites=true&w=majority&appName=NutrIA', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

export { Department as D, Message as M, connectDB as c };
