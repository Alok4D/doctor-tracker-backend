"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Patient = void 0;
const mongoose_1 = require("mongoose");
const patientSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Patient name is required'],
        trim: true,
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [0, 'Age cannot be negative'],
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: [true, 'Gender is required'],
    },
    condition: {
        type: String,
        required: [true, 'Condition / Diagnosis is required'],
        trim: true,
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
    },
    doctorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: [true, 'Assigned Doctor is required'],
    },
    status: {
        type: String,
        enum: ['Admitted', 'Discharged', 'Followup', 'Transferred'],
        default: 'Admitted',
    },
    admissionDate: {
        type: String,
        default: () => new Date().toISOString().split('T')[0],
    },
    avatarUrl: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});
// Performance & Query Optimization Indexes (PDF Page 5)
patientSchema.index({ doctorId: 1 });
patientSchema.index({ name: 'text', phone: 'text' });
patientSchema.index({ condition: 1, status: 1 });
patientSchema.index({ createdAt: -1 });
exports.Patient = (0, mongoose_1.model)('Patient', patientSchema);
