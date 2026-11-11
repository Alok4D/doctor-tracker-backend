"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Doctor = void 0;
const mongoose_1 = require("mongoose");
const doctorSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Doctor name is required'],
        trim: true,
    },
    specialization: {
        type: String,
        required: [true, 'Specialization is required'],
        trim: true,
    },
    hospital: {
        type: String,
        required: [true, 'Hospital is required'],
        trim: true,
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
    avatarUrl: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Virtual field to link corresponding patients
doctorSchema.virtual('patients', {
    ref: 'Patient',
    localField: '_id',
    foreignField: 'doctorId',
});
// Optimization Indexes (Required by PDF Page 5)
doctorSchema.index({ name: 'text', specialization: 'text', hospital: 'text' });
doctorSchema.index({ specialization: 1, createdAt: -1 });
doctorSchema.index({ createdAt: -1 });
exports.Doctor = (0, mongoose_1.model)('Doctor', doctorSchema);
