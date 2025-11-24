const mongoose = require('mongoose');
const readline = require('readline');

// Create interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function makeAdmin() {
    try {
        console.log('\n🔐 RaiseVoice Admin Tool\n');
        
        // Get MongoDB URI
        let uri = process.env.MONGODB_URI;
        if (!uri) {
            console.log('No MONGODB_URI found in environment.');
            uri = await question('Enter your MongoDB Connection String (e.g., mongodb+srv://...): ');
        } else {
            console.log('Using MONGODB_URI from environment.');
        }

        if (!uri) {
            console.error('❌ Error: MongoDB URI is required.');
            process.exit(1);
        }

        // Connect to DB
        console.log('\nConnecting to MongoDB...');
        await mongoose.connect(uri);
        console.log('✅ Connected successfully.');

        // Define User Schema (minimal)
        const UserSchema = new mongoose.Schema({
            email: String,
            role: String,
            name: String
        });
        
        // Use existing model or create new one
        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        // Get Email
        const email = await question('\nEnter the email of the user to make Admin: ');
        
        if (!email) {
            console.error('❌ Error: Email is required.');
            process.exit(1);
        }

        // Find User
        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            console.error(`❌ Error: User with email "${email}" not found.`);
            process.exit(1);
        }

        console.log(`\nFound User: ${user.name} (${user.email})`);
        console.log(`Current Role: ${user.role || 'none'}`);

        // Confirm
        const confirm = await question('\nAre you sure you want to make this user an ADMIN? (y/n): ');
        
        if (confirm.toLowerCase() === 'y') {
            user.role = 'admin';
            await user.save();
            console.log('\n✅ Success! User is now an Admin.');
            console.log('NOTE: The user must sign out and sign back in for changes to take effect.');
        } else {
            console.log('\nOperation cancelled.');
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        rl.close();
        process.exit(0);
    }
}

makeAdmin();
