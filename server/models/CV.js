const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
    personalInfo: {
        name: {
            type: String,
            trim: true,
            default: ''
        },
        title: {
            type: String,
            trim: true,
            default: ''
        },
        email: {
            type: String,
            trim: true,
            default: ''
        },
        phone: {
            type: String,
            trim: true,
            default: ''
        },
        location: {
            type: String,
            trim: true,
            default: ''
        }
    },
    summary: {
        type: String,
        trim: true,
        default: ''
    },
    experience: [{
        position: {
            type: String,
            trim: true,
            default: ''
        },
        company: {
            type: String,
            trim: true,
            default: ''
        },
        startDate: {
            type: String,
            trim: true,
            default: ''
        },
        endDate: {
            type: String,
            trim: true,
            default: ''
        },
        current: {
            type: Boolean,
            default: false
        },
        description: {
            type: String,
            trim: true,
            default: ''
        },
        achievements: [{
            type: String,
            trim: true
        }]
    }],
    education: [{
        degree: {
            type: String,
            trim: true,
            default: ''
        },
        institution: {
            type: String,
            trim: true,
            default: ''
        },
        startDate: {
            type: String,
            trim: true,
            default: ''
        },
        endDate: {
            type: String,
            trim: true,
            default: ''
        }
    }],
    skills: [{
        category: {
            type: String,
            trim: true,
            default: ''
        },
        items: [{
            type: String,
            trim: true
        }]
    }],
    certifications: [{
        name: {
            type: String,
            trim: true,
            default: ''
        },
        institution: {
            type: String,
            trim: true,
            default: ''
        },
        date: {
            type: String,
            trim: true,
            default: ''
        }
    }],
    languages: [{
        name: {
            type: String,
            trim: true,
            default: ''
        },
        level: {
            type: String,
            trim: true,
            default: ''
        }
    }],
    pdfUrl: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'PDF URL must be a valid URL'
        },
        default: ''
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false // We'll handle updatedAt manually
});

// Update the updatedAt timestamp before saving
cvSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('CV', cvSchema);


