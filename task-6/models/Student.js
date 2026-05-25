const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Student name is required.'],
      trim: true,
      minlength: [2, 'Student name must be at least 2 characters.'],
      maxlength: [100, 'Student name must be less than 100 characters.']
    },
    email: {
      type: String,
      required: [true, 'Student email is required.'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required.'],
      trim: true
    },
    course: {
      type: String,
      required: [true, 'Course is required.'],
      trim: true
    },
    enrollmentNumber: {
      type: String,
      required: [true, 'Enrollment number is required.'],
      uppercase: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'graduated', 'blocked'],
      default: 'active'
    },
    grade: {
      type: String,
      enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'NA'],
      default: 'NA'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

studentSchema.index({ email: 1, createdBy: 1 }, { unique: true });
studentSchema.index({ enrollmentNumber: 1, createdBy: 1 }, { unique: true });
studentSchema.index({ fullName: 'text', email: 'text', course: 'text', enrollmentNumber: 'text' });

module.exports = mongoose.model('Student', studentSchema);
