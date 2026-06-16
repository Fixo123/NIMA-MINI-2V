const mongoose = require('mongoose');
const config = require('../config');

const connectdb = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(config.MONGODB_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("✅ Database Connected Successfully");
    } catch (e) {
        console.error("❌ Database Connection Failed:", e.message);
        // FIX: DB fail වුනාට bot crash නොවෙයි
    }
};

const inconnuboySessionSchema = new mongoose.Schema({
    number: { type: String, required: true, unique: true, index: true },
    credentials: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const inconnuboyConfigSchema = new mongoose.Schema({
    number: { type: String, required: true, unique: true, index: true },
    config: {
        AUTO_RECORDING: { type: String, default: 'false' },
        AUTO_TYPING:    { type: String, default: 'false' },
        ANTI_CALL:      { type: String, default: 'false' },
        REJECT_MSG:     { type: String, default: '*🔕 Call rejected automatically.*' },
        READ_MESSAGE:   { type: String, default: 'false' },
        AUTO_VIEW_STATUS:  { type: String, default: 'false' },
        AUTO_LIKE_STATUS:  { type: String, default: 'false' },
        AUTO_STATUS_REPLY: { type: String, default: 'false' },
        AUTO_STATUS_MSG:   { type: String, default: 'Nice status! 🔥' },
        AUTO_LIKE_EMOJI:   { type: Array,  default: ['❤️', '👍', '😮', '😎'] },
        ANTIDELETE:     { type: String, default: 'false' },
        // FIX: AUTO_VOICE, AUTO_STICKER, AUTO_REPLY schema ෙකට add කළා
        AUTO_VOICE:     { type: String, default: 'true' },
        AUTO_STICKER:   { type: String, default: 'true' },
        AUTO_REPLY:     { type: String, default: 'true' },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const inconnuboyOtpSchema = new mongoose.Schema({
    number:    { type: String, required: true, index: true },
    otp:       { type: String, required: true },
    config:    { type: Object, required: true },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 5 * 60000), index: { expires: '5m' } },
    createdAt: { type: Date, default: Date.now }
});

const inconnuboyActiveNumberSchema = new mongoose.Schema({
    number:        { type: String, required: true, unique: true, index: true },
    lastConnected: { type: Date, default: Date.now },
    isActive:      { type: Boolean, default: true },
    connectionInfo: { ip: String, userAgent: String, timestamp: Date }
});

const inconnuboyStatsSchema = new mongoose.Schema({
    number:           { type: String, required: true },
    date:             { type: String, required: true },
    commandsUsed:     { type: Number, default: 0 },
    messagesReceived: { type: Number, default: 0 },
    messagesSent:     { type: Number, default: 0 },
    groupsInteracted: { type: Number, default: 0 }
});

const Session      = mongoose.model('InconnuboySession', inconnuboySessionSchema);
const UserConfig   = mongoose.model('InconnuboyConfig', inconnuboyConfigSchema);
const OTP          = mongoose.model('InconnuboyOTP', inconnuboyOtpSchema);
const ActiveNumber = mongoose.model('InconnuboyActiveNumber', inconnuboyActiveNumberSchema);
const Stats        = mongoose.model('InconnuboyStats', inconnuboyStatsSchema);

async function saveSessionToMongoDB(number, credentials) {
    try {
        const cleanNumber = number.replace(/[^0-9]/g, '');
        await Session.findOneAndUpdate(
            { number: cleanNumber },
            { credentials, updatedAt: new Date() },
            { upsert: true, new: true }
        );
        return true;
    } catch (error) {
        console.error('❌ Error saving session:', error.message);
        return false;
    }
}

async function getSessionFromMongoDB(number) {
    try {
        const cleanNumber = number.replace(/[^0-9]/g, '');
        const session = await Session.findOne({ number: cleanNumber });
        return session ? session.credentials : null;
    } catch (error) {
        console.error('❌ Error getting session:', error.message);
        return null;
    }
}

async function deleteSessionFromMongoDB(number) {
    try {
        const cleanNumber = number.replace(/[^0-9]/g, '');
        await Session.deleteOne({ number: cleanNumber });
        await ActiveNumber.deleteOne({ number: cleanNumber });
        return true;
    } catch (error) {
        console.error('❌ Error deleting session:', error.message);
        return false;
    }
}

async function getUserConfigFromMongoDB(number) {
    try {
        const cleanNumber = number.replace(/[^0-9]/g, '');
        const doc = await UserConfig.findOne({ number: cleanNumber });

        if (doc) return doc.config;

        // FIX: Default config includes AUTO_VOICE/STICKER/REPLY = true
        const defaultConfig = {
            AUTO_RECORDING: 'false',
            AUTO_TYPING:    'false',
            ANTI_CALL:      'false',
            REJECT_MSG:     '*🔕 Call rejected automatically.*',
            READ_MESSAGE:   'false',
            AUTO_VIEW_STATUS:  'false',
            AUTO_LIKE_STATUS:  'false',
            AUTO_STATUS_REPLY: 'false',
            AUTO_STATUS_MSG:   'Nice status! 🔥',
            AUTO_LIKE_EMOJI:   ['❤️', '👍', '😮', '😎'],
            ANTIDELETE:     'false',
            AUTO_VOICE:     'true',
            AUTO_STICKER:   'true',
            AUTO_REPLY:     'true',
        };

        await UserConfig.create({ number: cleanNumber, config: defaultConfig });
        return defaultConfig;
    } catch (error) {
        console.error('❌ Error getting user config:', error.message);
        // FIX: DB error නම් config.js values use කිරීමට {} return කරනවා
        return {};
    }
}

async function updateUserConfigInMongoDB(number, newConfig) {
    try {
        const cleanNumber = number.replace(/[^0-9]/g, '');
        await UserConfig.findOneAndUpdate(
            { number: cleanNumber },
            { config: newConfig, updatedAt: new Date() },
            { upsert: true, new: true }
        );
        return true;
    } catch (error) {
        console.error('❌ Error updating user config:', error.message);
        return false;
    }
}

async function saveOTPToMongoDB(number, otp, config) {
    try {
        const cleanNumber = number.replace(/[^0-9]/g, '');
        await OTP.create({ number: cleanNumber, otp, config });
        return true;
    } catch (error) {
        console.error('❌ Error saving OTP:', error.message);
        return false;
    }
}

async function verifyOTPFromMongoDB(number, otp) {
    try {
        const cleanNumber = number.replace(/[^0-9]/g, '');
        const otpRecord = await OTP.findOne({
            number: cleanNumber,
            otp,
            expiresAt: { $gt: new Date() }
        });
        if (!otpRecord) return { valid: false, error: 'Invalid or expired OTP' };
        await OTP.deleteOne({ _id: otpRecord._id });
        return { valid: true, config: otpRecord.config };
    } catch (error) {
        console.error('❌ Error verifying OTP:', error.message);
        return { valid: false, error: 'Verification error' };
    }
}

async function addNumberToMongoDB(number) {
    try {
        const cleanNumber = number.replace(/[^0-9]/g, '');
        await ActiveNumber.findOneAndUpdate(
            { number: cleanNumber },
            { lastConnected: new Date(), isActive: true },
            { upsert: true, new: true }
        );
        return true;
    } catch (error) {
        console.error('❌ Error adding number:', error.message);
        return false;
    }
}

async function removeNumberFromMongoDB(number) {
    try {
        const cleanNumber = number.replace(/[^0-9]/g, '');
        await ActiveNumber.deleteOne({ number: cleanNumber });
        return true;
    } catch (error) {
        console.error('❌ Error removing number:', error.message);
        return false;
    }
}

async function getAllNumbersFromMongoDB() {
    try {
        const activeNumbers = await ActiveNumber.find({ isActive: true });
        return activeNumbers.map(num => num.number);
    } catch (error) {
        console.error('❌ Error getting numbers:', error.message);
        return [];
    }
}

async function incrementStats(number, field) {
    try {
        const cleanNumber = number.replace(/[^0-9]/g, '');
        const today = new Date().toISOString().split('T')[0];
        await Stats.findOneAndUpdate(
            { number: cleanNumber, date: today },
            { $inc: { [field]: 1 } },
            { upsert: true, new: true }
        );
    } catch (error) {
        console.error('❌ Error updating stats:', error.message);
    }
}

async function getStatsForNumber(number) {
    try {
        const cleanNumber = number.replace(/[^0-9]/g, '');
        return await Stats.find({ number: cleanNumber }).sort({ date: -1 }).limit(30);
    } catch (error) {
        console.error('❌ Error getting stats:', error.message);
        return [];
    }
}

module.exports = {
    connectdb,
    Session, UserConfig, OTP, ActiveNumber, Stats,
    saveSessionToMongoDB,
    getSessionFromMongoDB,
    deleteSessionFromMongoDB,
    getUserConfigFromMongoDB,
    updateUserConfigInMongoDB,
    saveOTPToMongoDB,
    verifyOTPFromMongoDB,
    addNumberToMongoDB,
    removeNumberFromMongoDB,
    getAllNumbersFromMongoDB,
    incrementStats,
    getStatsForNumber,
    getUserConfig: async (number) => {
        const cfg = await getUserConfigFromMongoDB(number);
        return cfg || {};
    },
    updateUserConfig: updateUserConfigInMongoDB
};
