/**
 * Seed Issues Cleanup Script
 *
 * Usage: node scripts/delete-seed-issues.js
 *
 * Connects directly to MongoDB and Cloudinary.
 * Finds all issues associated with the seed user (seed@raisevoice.com),
 * deletes all associated images from Cloudinary, and then deletes
 * the issues from MongoDB.
 */

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;

// ─── Load .env manually (no dotenv dependency needed) ────────────────────────
const envPath = path.resolve(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*?)\s*$/);
    if (match && !match[1].startsWith("#")) process.env[match[1]] = match[2];
  });
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env");
  process.exit(1);
}

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("❌ Cloudinary credentials not found in .env");
  process.exit(1);
}

// ─── Configure Cloudinary ────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Mongoose Schemas (inline, lightweight) ──────────────────────────────────
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true, trim: true },
});

const IssueSchema = new mongoose.Schema({
  title: String,
  images: [String],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Issue = mongoose.models.Issue || mongoose.model("Issue", IssueSchema);

// ─── Helper function to extract Cloudinary Public ID ─────────────────────────
function getPublicIdFromUrl(url) {
  try {
    // URL example: https://res.cloudinary.com/<cloud_name>/image/upload/v12345678/raisevoice/abcxyz.jpg
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return null;
    
    // Get everything after "/upload/"
    const afterUpload = url.substring(uploadIndex + 8);
    
    // Split by '/' to find and remove version tag if it exists (starts with 'v' followed by digits)
    const parts = afterUpload.split("/");
    if (parts[0].match(/^v\d+$/)) {
      parts.shift(); // Remove version tag
    }
    
    // Rejoin the remaining parts which constitute the folder structure + filename
    const publicIdWithExtension = parts.join("/");
    
    // Remove the file extension
    return publicIdWithExtension.replace(/\.[^/.]+$/, "");
  } catch (error) {
    console.error(`Failed to extract public ID from URL: ${url}`, error);
    return null;
  }
}

// ─── Main Execution script ───────────────────────────────────────────────────
async function run() {
  let conn;
  try {
    console.log(`Connecting to MongoDB...`);
    conn = await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB.");

    // 1. Find the seed user
    const SEED_EMAIL = "seed@raisevoice.com";
    const seedUser = await User.findOne({ email: SEED_EMAIL });

    if (!seedUser) {
      console.log(`ℹ️ Seed user (${SEED_EMAIL}) not found. Nothing to delete.`);
      return;
    }

    console.log(`🔍 Found seed user with ID: ${seedUser._id}`);

    // 2. Find all issues for the seed user
    const issues = await Issue.find({ userId: seedUser._id });
    console.log(`📋 Found ${issues.length} issues created by the seed user.`);

    if (issues.length === 0) {
      console.log("ℹ️ No issues to delete.");
      return;
    }

    // 3. Extract all image URLs
    let allMediaUrls = [];
    issues.forEach(issue => {
      if (issue.images && issue.images.length > 0) {
        allMediaUrls.push(...issue.images);
      }
    });

    console.log(`🖼️ Found ${allMediaUrls.length} associated images.`);

    // 4. Delete images from Cloudinary
    if (allMediaUrls.length > 0) {
      const publicIds = allMediaUrls
        .map(getPublicIdFromUrl)
        .filter(id => id !== null);

      console.log(`☁️ Deleting ${publicIds.length} images from Cloudinary...`);
      
      // Cloudinary allows deleting multiple images at once (up to 100 per API call typically)
      // We will chunk the array into sizes of 100 just to be safe
      const chunkSize = 100;
      for (let i = 0; i < publicIds.length; i += chunkSize) {
        const chunk = publicIds.slice(i, i + chunkSize);
        console.log(`   Deleting batch ${Math.floor(i/chunkSize) + 1} of ${Math.ceil(publicIds.length/chunkSize)}...`);
        const result = await cloudinary.api.delete_resources(chunk);
        console.log(`   Batch result:`, Object.keys(result.deleted || {}).length, "files successfully deleted/not found.");
      }
      console.log("✅ Cloudinary cleanup complete.");
    }

    // 5. Delete issues from MongoDB
    console.log(`🗑️ Deleting ${issues.length} issues from MongoDB...`);
    const deleteResult = await Issue.deleteMany({ userId: seedUser._id });
    console.log(`✅ MongoDB cleanup complete. Deleted ${deleteResult.deletedCount} documents.`);

    console.log("🎉 All seed cleanup tasks finished successfully!");

  } catch (err) {
    console.error("❌ Script Error:", err);
  } finally {
    if (conn) {
      console.log("Closing MongoDB connection...");
      await mongoose.disconnect();
    }
    process.exit(0);
  }
}

run();
