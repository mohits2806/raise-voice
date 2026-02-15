/**
 * Seed Script: Insert ~300 realistic civic issues across India
 *
 * Usage:  node scripts/seed-issues.js
 *
 * Connects directly to MongoDB (using MONGODB_URI from .env),
 * creates/reuses a seed user, and bulk-inserts issues with
 * images, varied statuses, and proper titles & descriptions.
 */

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// ─── Load .env manually (no dotenv dependency needed) ────────────────────────
const envPath = path.resolve(__dirname, "..", ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const envVars = {};
envContent.split(/\r?\n/).forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*?)\s*$/);
  if (match && !match[1].startsWith("#")) envVars[match[1]] = match[2];
});
const MONGODB_URI = envVars.MONGODB_URI;
const NEXT_PUBLIC_APP_URL =
  envVars.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env");
  process.exit(1);
}

// ─── Mongoose Schemas (inline, lightweight) ──────────────────────────────────
const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, lowercase: true, trim: true },
    password: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    provider: { type: String, default: "credentials" },
  },
  { timestamps: true },
);

const IssueSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: {
      type: String,
      enum: [
        "water-supply",
        "puddle",
        "road",
        "garbage",
        "electricity",
        "streetlight",
        "other",
      ],
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved"],
      default: "open",
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: [Number],
    },
    address: String,
    images: [String],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isAnonymous: { type: Boolean, default: true },
  },
  { timestamps: true },
);
IssueSchema.index({ location: "2dsphere" });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Issue = mongoose.models.Issue || mongoose.model("Issue", IssueSchema);

// ─── India-wide city data ────────────────────────────────────────────────────
// 50 major cities across India with real coordinates and local area names.
// Each city has: name, lat, lng, and a list of real localities/landmarks.

const INDIA_CITIES = [
  {
    name: "Mumbai",
    lat: 19.076,
    lng: 72.8777,
    areas: [
      "Andheri West",
      "Bandra East",
      "Dadar",
      "Borivali",
      "Goregaon",
      "Malad",
      "Kurla",
      "Vikhroli",
    ],
  },
  {
    name: "Delhi",
    lat: 28.6139,
    lng: 77.209,
    areas: [
      "Connaught Place",
      "Karol Bagh",
      "Dwarka",
      "Rohini",
      "Saket",
      "Lajpat Nagar",
      "Janakpuri",
      "Pitampura",
    ],
  },
  {
    name: "Bangalore",
    lat: 12.9716,
    lng: 77.5946,
    areas: [
      "Koramangala",
      "Indiranagar",
      "Whitefield",
      "Jayanagar",
      "HSR Layout",
      "Electronic City",
      "Marathahalli",
      "BTM Layout",
    ],
  },
  {
    name: "Chennai",
    lat: 13.0827,
    lng: 80.2707,
    areas: [
      "T. Nagar",
      "Anna Nagar",
      "Adyar",
      "Velachery",
      "Mylapore",
      "Tambaram",
      "Porur",
      "Nungambakkam",
    ],
  },
  {
    name: "Kolkata",
    lat: 22.5726,
    lng: 88.3639,
    areas: [
      "Salt Lake",
      "Park Street",
      "Howrah",
      "Dum Dum",
      "New Town",
      "Gariahat",
      "Behala",
      "Tollygunge",
    ],
  },
  {
    name: "Hyderabad",
    lat: 17.385,
    lng: 78.4867,
    areas: [
      "Banjara Hills",
      "Madhapur",
      "Gachibowli",
      "Kukatpally",
      "Ameerpet",
      "Secunderabad",
      "Begumpet",
      "Kondapur",
    ],
  },
  {
    name: "Pune",
    lat: 18.5204,
    lng: 73.8567,
    areas: [
      "Shivaji Nagar",
      "Kothrud",
      "Hinjewadi",
      "Hadapsar",
      "Deccan",
      "Aundh",
      "Wakad",
      "Baner",
    ],
  },
  {
    name: "Ahmedabad",
    lat: 23.0225,
    lng: 72.5714,
    areas: [
      "Navrangpura",
      "Satellite",
      "Maninagar",
      "Vastrapur",
      "Bodakdev",
      "SG Highway",
      "Ellis Bridge",
      "Paldi",
    ],
  },
  {
    name: "Jaipur",
    lat: 26.9124,
    lng: 75.7873,
    areas: [
      "C-Scheme",
      "Malviya Nagar",
      "Vaishali Nagar",
      "Mansarovar",
      "Raja Park",
      "Tonk Road",
      "Sodala",
      "Jagatpura",
    ],
  },
  {
    name: "Lucknow",
    lat: 26.8467,
    lng: 80.9462,
    areas: [
      "Hazratganj",
      "Gomti Nagar",
      "Aliganj",
      "Indira Nagar",
      "Aminabad",
      "Alambagh",
      "Mahanagar",
      "Chowk",
    ],
  },
  {
    name: "Nagpur",
    lat: 21.1458,
    lng: 79.0882,
    areas: [
      "Sitabuldi",
      "Dharampeth",
      "Sadar",
      "Civil Lines",
      "Wardha Road",
      "Hingna Road",
      "Manewada",
      "Nandanvan",
    ],
  },
  {
    name: "Chandigarh",
    lat: 30.7333,
    lng: 76.7794,
    areas: [
      "Sector 17",
      "Sector 22",
      "Sector 35",
      "Sector 43",
      "Mani Majra",
      "Panchkula",
      "Mohali",
      "Industrial Area",
    ],
  },
  {
    name: "Bhopal",
    lat: 23.2599,
    lng: 77.4126,
    areas: [
      "MP Nagar",
      "New Market",
      "Arera Colony",
      "Kolar Road",
      "Hoshangabad Road",
      "TT Nagar",
      "Shahpura",
      "Bairagarh",
    ],
  },
  {
    name: "Indore",
    lat: 22.7196,
    lng: 75.8577,
    areas: [
      "Vijay Nagar",
      "Palasia",
      "Rajwada",
      "Sapna Sangeeta",
      "MG Road",
      "AB Road",
      "Bhawarkua",
      "Geeta Bhawan",
    ],
  },
  {
    name: "Patna",
    lat: 25.6093,
    lng: 85.1376,
    areas: [
      "Boring Road",
      "Kankarbagh",
      "Patliputra",
      "Fraser Road",
      "Bailey Road",
      "Rajendra Nagar",
      "Danapur",
      "Bankipur",
    ],
  },
  {
    name: "Surat",
    lat: 21.1702,
    lng: 72.8311,
    areas: [
      "Adajan",
      "Vesu",
      "Athwa",
      "Ring Road",
      "Varachha",
      "Katargam",
      "City Light",
      "Pal",
    ],
  },
  {
    name: "Kanpur",
    lat: 26.4499,
    lng: 80.3319,
    areas: [
      "Mall Road",
      "Swaroop Nagar",
      "Kidwai Nagar",
      "Kakadeo",
      "Civil Lines",
      "Govind Nagar",
      "Shastri Nagar",
      "Kalyanpur",
    ],
  },
  {
    name: "Varanasi",
    lat: 25.3176,
    lng: 82.9739,
    areas: [
      "Dashashwamedh Ghat",
      "Assi Ghat",
      "Lanka",
      "Sigra",
      "Cantonment",
      "Bhelupur",
      "Godowlia",
      "Sarnath",
    ],
  },
  {
    name: "Visakhapatnam",
    lat: 17.6868,
    lng: 83.2185,
    areas: [
      "Beach Road",
      "MVP Colony",
      "Gajuwaka",
      "Maddilapalem",
      "Dwaraka Nagar",
      "Seethammadhara",
      "Pendurthi",
      "NAD Junction",
    ],
  },
  {
    name: "Coimbatore",
    lat: 11.0168,
    lng: 76.9558,
    areas: [
      "RS Puram",
      "Gandhipuram",
      "Peelamedu",
      "Saibaba Colony",
      "Ukkadam",
      "Singanallur",
      "Vadavalli",
      "Ganapathy",
    ],
  },
  {
    name: "Thiruvananthapuram",
    lat: 8.5241,
    lng: 76.9366,
    areas: [
      "MG Road",
      "Palayam",
      "Kowdiar",
      "Thampanoor",
      "Pattom",
      "Vellayambalam",
      "Kazhakkoottam",
      "Technopark",
    ],
  },
  {
    name: "Kochi",
    lat: 9.9312,
    lng: 76.2673,
    areas: [
      "MG Road Ernakulam",
      "Edappally",
      "Vyttila",
      "Kakkanad",
      "Fort Kochi",
      "Kaloor",
      "Aluva",
      "Palarivattom",
    ],
  },
  {
    name: "Guwahati",
    lat: 26.1445,
    lng: 91.7362,
    areas: [
      "Paltan Bazaar",
      "Fancy Bazaar",
      "Christian Basti",
      "Zoo Road",
      "Ganeshguri",
      "Dispur",
      "Beltola",
      "Chandmari",
    ],
  },
  {
    name: "Bhubaneswar",
    lat: 20.2961,
    lng: 85.8245,
    areas: [
      "Saheed Nagar",
      "Nayapalli",
      "Patia",
      "Khandagiri",
      "Jaydev Vihar",
      "Acharya Vihar",
      "Unit 4",
      "Rasulgarh",
    ],
  },
  {
    name: "Ranchi",
    lat: 23.3441,
    lng: 85.3096,
    areas: [
      "Main Road",
      "Lalpur",
      "Doranda",
      "Harmu",
      "Kanke Road",
      "Morabadi",
      "Ratu Road",
      "Ashok Nagar",
    ],
  },
  {
    name: "Dehradun",
    lat: 30.3165,
    lng: 78.0322,
    areas: [
      "Rajpur Road",
      "Clock Tower",
      "Paltan Bazaar",
      "Race Course",
      "Dalanwala",
      "Hathibarkala",
      "Clement Town",
      "Ballupur",
    ],
  },
  {
    name: "Amritsar",
    lat: 31.634,
    lng: 74.8723,
    areas: [
      "Hall Bazaar",
      "Lawrence Road",
      "Ranjit Avenue",
      "Golden Temple Area",
      "Majitha Road",
      "GT Road",
      "White Avenue",
      "Mall Road",
    ],
  },
  {
    name: "Mysore",
    lat: 12.2958,
    lng: 76.6394,
    areas: [
      "Saraswathipuram",
      "Vijayanagar",
      "Gokulam",
      "Kuvempunagar",
      "Devaraja Mohalla",
      "Jayalakshmipuram",
      "Nazarbad",
      "Vontikoppal",
    ],
  },
  {
    name: "Aurangabad",
    lat: 19.8762,
    lng: 75.3433,
    areas: [
      "CIDCO",
      "Osmanpura",
      "Gulmandi",
      "Station Road",
      "Nirala Bazaar",
      "Jalna Road",
      "Cantonment",
      "Town Centre",
    ],
  },
  {
    name: "Nashik",
    lat: 20.0063,
    lng: 73.7936,
    areas: [
      "College Road",
      "Gangapur Road",
      "Panchavati",
      "Nashik Road",
      "Satpur",
      "CIDCO",
      "Indira Nagar",
      "Deolali Camp",
    ],
  },
  {
    name: "Rajkot",
    lat: 22.3039,
    lng: 70.8022,
    areas: [
      "Kalavad Road",
      "University Road",
      "Yagnik Road",
      "Kalawad Road",
      "150 Feet Ring Road",
      "Amin Marg",
      "Jamnagar Road",
      "Race Course",
    ],
  },
  {
    name: "Vadodara",
    lat: 22.3072,
    lng: 73.1812,
    areas: [
      "Alkapuri",
      "Fatehgunj",
      "Manjalpur",
      "Sayajigunj",
      "Gotri",
      "Vasna Road",
      "Karelibaug",
      "Waghodia Road",
    ],
  },
  {
    name: "Raipur",
    lat: 21.2514,
    lng: 81.6296,
    areas: [
      "Telibandha",
      "Shankar Nagar",
      "Pandri",
      "Civil Lines",
      "Fafadih",
      "Tatibandh",
      "Devendra Nagar",
      "Samta Colony",
    ],
  },
  {
    name: "Jodhpur",
    lat: 26.2389,
    lng: 73.0243,
    areas: [
      "Ratanada",
      "Sardarpura",
      "Paota",
      "Shastri Nagar",
      "Chopasni Road",
      "Mandore Road",
      "Residency Road",
      "Pal Road",
    ],
  },
  {
    name: "Udaipur",
    lat: 24.5854,
    lng: 73.7125,
    areas: [
      "Hiran Magri",
      "Chetak Circle",
      "Fateh Sagar",
      "Sukhadia Circle",
      "Pratap Nagar",
      "University Road",
      "Ambamata",
      "Bhatt Ji Ki Bari",
    ],
  },
  {
    name: "Agra",
    lat: 27.1767,
    lng: 78.0081,
    areas: [
      "Sadar Bazaar",
      "Fatehabad Road",
      "Sanjay Place",
      "MG Road",
      "Civil Lines",
      "Kamla Nagar",
      "Shahganj",
      "Taj Nagari",
    ],
  },
  {
    name: "Allahabad",
    lat: 25.4358,
    lng: 81.8463,
    areas: [
      "Civil Lines",
      "George Town",
      "Katra",
      "Rajapur",
      "Lukerganj",
      "Chowk",
      "Naini",
      "Jhusi",
    ],
  },
  {
    name: "Madurai",
    lat: 9.9252,
    lng: 78.1198,
    areas: [
      "Anna Nagar",
      "KK Nagar",
      "Mattuthavani",
      "Goripalayam",
      "Ellis Nagar",
      "Tallakulam",
      "Vilangudi",
      "Thiruppalai",
    ],
  },
  {
    name: "Tiruchirappalli",
    lat: 10.7905,
    lng: 78.7047,
    areas: [
      "Cantonment",
      "Thillai Nagar",
      "Woraiyur",
      "Srirangam",
      "KK Nagar",
      "Puthur",
      "Tennur",
      "Crawford",
    ],
  },
  {
    name: "Mangalore",
    lat: 12.9141,
    lng: 74.856,
    areas: [
      "Hampankatta",
      "Kadri",
      "Kankanady",
      "Bejai",
      "Falnir",
      "Bendoor",
      "Attavar",
      "Pumpwell",
    ],
  },
  {
    name: "Shimla",
    lat: 31.1048,
    lng: 77.1734,
    areas: [
      "Mall Road",
      "Lakkar Bazaar",
      "Sanjauli",
      "Chhota Shimla",
      "Boileauganj",
      "Tutikandi",
      "Summer Hill",
      "Dhalli",
    ],
  },
  {
    name: "Goa (Panaji)",
    lat: 15.4909,
    lng: 73.8278,
    areas: [
      "Panaji Market",
      "Miramar",
      "Dona Paula",
      "Taleigao",
      "Patto",
      "Altinho",
      "Campal",
      "Fontainhas",
    ],
  },
  {
    name: "Jammu",
    lat: 32.7266,
    lng: 74.857,
    areas: [
      "Gandhi Nagar",
      "Residency Road",
      "Rehari",
      "Talab Tillo",
      "Channi Himmat",
      "Janipur",
      "Trikuta Nagar",
      "Bakshi Nagar",
    ],
  },
  {
    name: "Vijayawada",
    lat: 16.5062,
    lng: 80.648,
    areas: [
      "Governorpet",
      "Labbipet",
      "Benz Circle",
      "Moghalrajpuram",
      "Patamata",
      "Gandhinagar",
      "Poranki",
      "Auto Nagar",
    ],
  },
  {
    name: "Kolhapur",
    lat: 16.705,
    lng: 74.2433,
    areas: [
      "Rajarampuri",
      "Shahupuri",
      "Tarabai Park",
      "Nagala Park",
      "Station Road",
      "Laxmipuri",
      "Shivaji Peth",
      "Rankala",
    ],
  },
  {
    name: "Thane",
    lat: 19.2183,
    lng: 72.9781,
    areas: [
      "Ghodbunder Road",
      "Naupada",
      "Majiwada",
      "Wagle Estate",
      "Pokhran Road",
      "Hiranandani Estate",
      "Kolshet",
      "Panchpakhadi",
    ],
  },
  {
    name: "Gwalior",
    lat: 26.2183,
    lng: 78.1828,
    areas: [
      "Lashkar",
      "City Centre",
      "Phool Bagh",
      "Thatipur",
      "Morar",
      "Maharani Laxmi Bai Marg",
      "Jayendraganj",
      "Kampoo",
    ],
  },
  {
    name: "Jabalpur",
    lat: 23.1815,
    lng: 79.9864,
    areas: [
      "Wright Town",
      "Napier Town",
      "Madan Mahal",
      "Vijay Nagar",
      "Adhartal",
      "Civil Lines",
      "Gol Bazaar",
      "Garha",
    ],
  },
  {
    name: "Noida",
    lat: 28.5355,
    lng: 77.391,
    areas: [
      "Sector 18",
      "Sector 62",
      "Sector 15",
      "Sector 44",
      "Greater Noida",
      "Sector 137",
      "Sector 50",
      "Film City",
    ],
  },
];

// Small random offset to spread issues within each city (±0.02 degrees ~2km)
const jitter = () => (Math.random() - 0.5) * 0.04;

// ─── Category-specific titles & descriptions ─────────────────────────────────

const ISSUE_DATA = {
  "water-supply": {
    titles: [
      "No water supply for 3 days",
      "Low water pressure in taps",
      "Contaminated water from municipal supply",
      "Broken water pipeline leaking on road",
      "Irregular water supply schedule",
      "Water tanker not arriving on time",
      "Rusty brown water from taps",
      "Water meter malfunctioning",
      "No drinking water in public stand-post",
      "Sewage mixing with drinking water line",
      "Water supply disrupted after pipeline repair",
      "Overhead tank not filling since last week",
      "Water logging near pump station",
      "Tap water has foul smell",
      "Hand pump broken in residential area",
    ],
    descriptions: [
      "Residents have been without water supply for three consecutive days. Multiple complaints to the municipal ward office have gone unanswered. We are forced to buy water tankers at Rs. 500 per trip.",
      "The water pressure in our entire locality has dropped to almost zero. Taps barely drip, making it impossible to fill even a single bucket in reasonable time. This has been ongoing for over a week.",
      "The municipal water supply has turned yellowish-brown with an unpleasant odor. Several families, including young children, have reported stomach issues after consuming this water.",
      "A major water pipeline burst near the junction creating a massive leak. Thousands of liters of water are being wasted daily while homes in the area receive no supply.",
      "Water supply in this ward was supposed to be every alternate day but we have not received water in the past 5 days. The schedule posted by the corporation is never followed.",
      "The water tanker that was scheduled for our colony has not arrived for the past 4 visits. There are over 200 families dependent on this tanker service.",
      "The water coming from taps is rust-colored and leaves brown stains on clothes and utensils. The old pipelines desperately need replacement.",
      "Our water meter has been malfunctioning for months, showing readings even when no water is flowing. Previous complaints have been closed without resolution.",
      "The public stand-post near the bus stop has been dry for weeks. Daily wage workers and travelers who depend on it for drinking water are severely affected.",
      "Sewage water is getting mixed into the drinking water pipeline due to damaged joints. The entire neighborhood is at risk of waterborne diseases.",
      "After the recent pipeline repair work, our area's water supply has been completely disrupted. The repair was done 10 days ago but service was never restored.",
      "The overhead community water tank in our colony has not been filling properly. The float valve seems broken and needs immediate repair.",
      "Stagnant water has accumulated around the municipal pump station creating a breeding ground for mosquitoes. The drainage around the station has been blocked.",
      "Tap water in this area has developed a strong chemical smell. Many residents suspect contamination from a nearby industrial unit.",
      "The hand pump installed by the municipality in our residential colony broke down two months ago. Over 50 families relied on it for supplementary water needs.",
    ],
  },
  puddle: {
    titles: [
      "Huge puddle blocking main road",
      "Drainage overflow flooding streets",
      "Stagnant water causing mosquito breeding",
      "Clogged drain near school entrance",
      "Open drain posing danger to children",
      "Sewage water overflowing on road",
      "Waterlogging after every rainfall",
      "Broken drainage cover on footpath",
      "Nullah overflow contaminating area",
      "Puddle filled with garbage and waste",
      "Drainage line completely blocked",
      "Flooded underpass near railway station",
      "Open manhole with stagnant water",
      "Permanent puddle at market entrance",
      "Drainage water entering residential homes",
    ],
    descriptions: [
      "A massive puddle, nearly 3 feet deep, has formed in the middle of the main road due to a blocked drain. Two-wheelers have to take a dangerous detour through oncoming traffic.",
      "The main drainage line has overflowed and sewage water is flowing freely on the street. The stench is unbearable and the area has become a health hazard for residents.",
      "Large pools of stagnant water have accumulated in multiple spots in our colony. Mosquito breeding has increased significantly, leading to several dengue and malaria cases.",
      "The drain near the school entrance is completely clogged with garbage and sludge. During drop-off and pick-up times, children have to wade through dirty water.",
      "An open drain running alongside the colony road has no safety cover. Last week a toddler fell into it. This is an extreme safety hazard that needs immediate attention.",
      "Raw sewage is overflowing from the drain onto the main road. The entire stretch for about 200 meters is covered in sewage water, making it impassable for pedestrians.",
      "Every time it rains even slightly, our entire locality gets waterlogged for days. The drainage infrastructure is simply not adequate for the population density.",
      "A drainage cover on the footpath has broken into pieces. Pedestrians, especially the elderly, risk falling into the open drain below. Needs urgent replacement.",
      "The nullah near our area overflows during every monsoon, sending contaminated water into homes and shops. No desilting work has been done this season.",
      "A puddle filled with rotting garbage and plastic waste has formed near the junction. It emits a horrible smell and is attracting stray animals and flies.",
      "The entire drainage line serving our ward is completely blocked. Wastewater has nowhere to go and is backing up into kitchen and bathroom drains in homes.",
      "The underpass near the railway station floods with just moderate rain. Commuters and auto-rickshaws get stuck for hours. The pumping system is non-functional.",
      "An open manhole on the main road is filled with stagnant black water. At night it is invisible and poses a severe accident risk for vehicles and pedestrians.",
      "A permanent puddle has formed at the market entrance due to broken drainage. Shopkeepers have lost business as customers avoid the area due to the mess.",
      "Drainage water is entering our homes every night when the water level rises in the clogged municipal drain. Our furniture and belongings are getting damaged.",
    ],
  },
  road: {
    titles: [
      "Massive pothole causing accidents",
      "Road completely damaged after monsoon",
      "Unpaved road in residential colony",
      "Speed breaker too high and unmarked",
      "Road cave-in near construction site",
      "Broken road divider creating hazard",
      "No road markings at busy junction",
      "Footpath encroached by vendors",
      "Road surface peeling off within months",
      "Missing road signage at blind turn",
      "Unfinished road construction left abandoned",
      "Narrow road with no drainage causing flooding",
      "Dangerous curves with no safety barriers",
      "Truck parking damaging residential road",
      "Road full of loose gravel and debris",
    ],
    descriptions: [
      "A massive pothole, about 2 feet deep and 4 feet wide, has formed on the main road. Multiple two-wheeler accidents have occurred here. A temporary fix was done last month but it has already worn away.",
      "The entire stretch of road in our area has been destroyed after the monsoon. What was once a decent road is now an obstacle course of potholes and broken concrete.",
      "Our residential colony has never had a proper paved road. During monsoon, the mud road becomes completely unusable. Ambulances and fire engines cannot access our colony.",
      "A speed breaker was constructed without any markings or warning signs. Several vehicles have been damaged. At night, it is completely invisible to drivers.",
      "A portion of the road near the construction site has caved in, creating a dangerous sinkhole. Despite barricading, vehicles keep falling into it, especially at night.",
      "The road divider at the major junction is broken in multiple places. Vehicles from both sides are cutting through these gaps, creating extremely dangerous crossover traffic.",
      "The busy junction near the market has absolutely no road markings, lane indicators, or directional arrows. Traffic chaos during peak hours leads to daily near-misses.",
      "Street vendors have completely taken over the footpath, forcing pedestrians to walk on the busy main road. This is especially dangerous for senior citizens and school children.",
      "The road that was resurfaced just 4 months ago has already started peeling off. The poor quality of materials used is evident — taxpayer money has been wasted.",
      "There is a dangerous blind turn on this road with absolutely no warning signs, mirrors, or signage. Multiple head-on collisions have occurred at this spot.",
      "Road construction started 6 months ago but was abandoned midway. Half the road is dug up with exposed metal rods and loose gravel creating a death trap.",
      "The narrow road has no side drainage at all. During rains, water flows along the road surface making it extremely slippery and dangerous for vehicles.",
      "A series of sharp curves on this road have no safety barriers or reflectors. At night, this stretch is extremely hazardous, especially for unfamiliar drivers.",
      "Heavy trucks park illegally on our residential street overnight, completely blocking the road and causing severe damage to the road surface.",
      "The road is covered with loose gravel and construction debris that was never cleaned up. Two-wheelers skid on this surface regularly.",
    ],
  },
  garbage: {
    titles: [
      "Garbage dump overflowing for weeks",
      "No garbage collection in our area",
      "Open burning of waste causing pollution",
      "Construction debris dumped on public land",
      "Dead animal carcass rotting on roadside",
      "Hospital waste found in regular garbage",
      "Overflowing community dustbin not cleared",
      "Illegal dumping ground behind residential area",
      "Garbage truck skipping our lane daily",
      "Plastic waste clogging drainage system",
      "Food waste attracting stray dogs and rats",
      "E-waste dumped near playground",
      "No segregated waste collection bins",
      "Garbage piled up near drinking water source",
      "Missed garbage collection for entire week",
    ],
    descriptions: [
      "The garbage collection point in our area has been overflowing for the past three weeks. The pile is now almost 6 feet high and the stench is spreading across the entire neighborhood.",
      "The municipal garbage collection van has not visited our area for over 10 days. Residents are forced to dump waste on roadsides, creating unsanitary conditions everywhere.",
      "Waste is being openly burned at the vacant lot every evening. The toxic smoke affects all surrounding households. Many children have developed respiratory problems.",
      "A truckload of construction debris has been illegally dumped on the public park land. The entire green space is now unusable and the debris is spreading to the footpath.",
      "A dead animal carcass has been lying on the roadside for over 4 days. Despite multiple calls to the municipal helpline, no one has come for removal. The decomposing body is a health hazard.",
      "Used syringes, blood-stained bandages, and other medical waste from a nearby clinic were found mixed with regular household garbage at the collection point.",
      "The large community dustbin at the market junction has been overflowing since last week. Garbage has spilled onto the road, blocking a traffic lane.",
      "An illegal garbage dumping site has developed behind our residential society. Trucks come at night to dump commercial waste. The area stinks 24/7.",
      "The garbage collection truck consistently skips our lane every day. When we complain, the driver says he does not have time. Meanwhile trash piles up.",
      "Plastic bags and bottle waste have completely clogged the drainage system near our area. This causes flooding even with light rain and the water becomes contaminated.",
      "Uncollected food waste near the market area has attracted packs of stray dogs and swarms of rats. They have become aggressive and residents are scared.",
      "Someone has dumped old computers, monitors, and electronic components near the children's playground. These contain hazardous materials and pose a danger to kids.",
      "Our area has no segregated waste collection system. Wet and dry waste is all mixed together. We want proper green and blue dustbins as announced by the corporation.",
      "Piles of garbage have accumulated dangerously close to the public drinking water source. Leachate from the waste is potentially contaminating the water supply.",
      "The entire colony has missed garbage collection for a full week. We understand there may be vehicle issues, but alternative arrangements should be made.",
    ],
  },
  electricity: {
    titles: [
      "Frequent power cuts during peak hours",
      "Exposed electrical wires on utility pole",
      "Transformer burning out repeatedly",
      "No electricity in new residential area",
      "Voltage fluctuation damaging appliances",
      "Power outage lasting more than 24 hours",
      "Sparking electrical junction box",
      "Meter reading disputes with MSEDCL",
      "Hanging wires after storm damage",
      "Three-phase power not available for months",
      "Electricity theft from main line",
      "Street transformer making buzzing noise",
      "No power backup during water supply hours",
      "Electric pole tilting dangerously",
      "Billing errors — charged double this month",
    ],
    descriptions: [
      "Our area experiences 4-5 hours of power cuts daily during evening peak hours (6 PM–10 PM). Students cannot study, businesses are losing money, and food spoils without refrigeration.",
      "Bare electrical wires are hanging from a damaged utility pole at child-height near the school. This is extremely dangerous — one touch could be fatal. Needs immediate insulation.",
      "The local transformer has burned out for the third time in two months. Each time it takes 3-4 days to replace, leaving hundreds of homes without power.",
      "Our newly developed residential area has been waiting for electricity connection for 8 months. Despite multiple applications and fees paid to MSEDCL, no transformer has been installed.",
      "Extreme voltage fluctuations are damaging household appliances. Three families on our street have lost refrigerators and TV sets this month alone due to sudden surges.",
      "We have had no electricity for over 24 hours after a cable fault. The MSEDCL helpline says a team has been dispatched but no one has arrived.",
      "An electrical junction box near the bus stop is visibly sparking and making crackling sounds, especially in humid weather. Passersby are at serious risk of electrocution.",
      "Our electricity meter readings are consistently inflated. Multiple households in our area have noticed bills that are 2-3 times higher than usual despite no change in consumption.",
      "Last week's storm brought down several electrical wires which are now hanging low over the road. Despite complaints, no crew has come to secure them.",
      "Our entire street has been on single-phase supply for 4 months instead of the promised three-phase. Motors, pumps, and ACs cannot run, causing severe inconvenience.",
      "Illegal electricity connections are being tapped directly from the main feeder line. This overloads the system and causes frequent tripping for legitimate consumers.",
      "The street transformer has been making a loud buzzing/humming noise for weeks. Residents near it are worried about potential explosion or fire hazard.",
      "Water supply in our area comes during specific hours when the pumps run. But there are scheduled power cuts during exactly those hours, so water never reaches overhead tanks.",
      "An electric pole on the main road is tilting at a dangerous angle after a truck hit it last month. It could fall at any time, endangering pedestrians and vehicles.",
      "This month's electricity bill is exactly double the usual amount with no explanation. When we visited the MSEDCL office, they said the meter was read correctly but we dispute this.",
    ],
  },
  streetlight: {
    titles: [
      "Street lights not working on entire stretch",
      "Broken street light pole after accident",
      "No lights installed in new layout",
      "Flickering street lights causing disturbance",
      "Street lights on during daytime",
      "Dark alley becoming unsafe for women",
      "LED street lights replaced with dim CFL",
      "Timer malfunction — lights turn off at midnight",
      "Street light wiring stolen repeatedly",
      "Burnt out bulbs not replaced for months",
      "No street lights near hospital entrance",
      "Light pole rusted and about to collapse",
      "Park area completely dark after sunset",
      "Street light glaring into bedroom windows",
      "Solar street lights not charging properly",
    ],
    descriptions: [
      "An entire stretch of the main road, approximately 500 meters, has been without working street lights for over two months. The darkness has led to multiple chain-snatching incidents.",
      "A street light pole was knocked down by a truck two weeks ago. The broken pole and shattered light are still lying on the footpath. No repair crew has visited.",
      "Our newly developed residential layout has over 30 houses but not a single street light has been installed. Walking after dark is dangerous and several falls have occurred.",
      "The street lights on our road flicker constantly throughout the night. The strobing effect is very disturbing for residents trying to sleep and is potentially triggering for those with epilepsy.",
      "Several street lights in our area remain on during broad daylight, wasting electricity. The photocell sensors or timers seem to be malfunctioning.",
      "The narrow alley connecting two main roads has no lighting at all. Women and elderly residents avoid using it after dark due to safety concerns. Several harassment incidents reported.",
      'Bright LED street lights were recently replaced with dim CFL bulbs during "upgradation" work. The CFL lights provide barely any illumination, worse than what we had before.',
      "Street lights are on a timer that shuts them off at midnight. However, many residents return from late shifts after midnight and the roads become completely dark and unsafe.",
      "The copper wiring of street lights in our area has been stolen three times in the past year. Each time it is repaired, thieves steal it again within weeks. Better security measures needed.",
      "At least 15 out of 20 street light bulbs on our road have burnt out and not been replaced despite complaints filed months ago. The road is in near-total darkness.",
      "The entrance road to the district hospital has no street lights. Patients, visitors, and ambulances struggle to navigate in the dark, especially during emergencies.",
      "A street light pole near the market is severely rusted at the base and leaning at an angle. One strong wind could bring it down on pedestrians or parked vehicles.",
      "The public park that many families use for evening walks becomes pitch dark after sunset. There are no functional lights inside the park, making it unsafe.",
      "A newly installed street light is positioned in a way that its bright LED light shines directly into the bedroom windows of adjacent houses, making sleep impossible.",
      "The solar street lights installed last year have stopped working. The batteries are not charging and the solar panels appear to be covered in dust and bird droppings.",
    ],
  },
  other: {
    titles: [
      "Stray dog menace in residential area",
      "Illegal construction blocking public pathway",
      "Public toilet in terrible condition",
      "Noise pollution from illegal loudspeakers",
      "Tree fallen blocking road — no clearance",
      "Encroachment on public playground",
      "Dangerous building at risk of collapse",
      "Unauthorized parking on footpath",
      "Missing manhole cover on busy road",
      "Public bench and seating area vandalized",
      "Mosquito fogging not done this season",
      "Traffic signal not working at junction",
      "Government school building in disrepair",
      "Unauthorized banner/hoarding blocking view",
      "Abandoned vehicle rusting on public road",
    ],
    descriptions: [
      "A pack of about 15-20 stray dogs has taken over our residential lane. They bark aggressively at night, chase two-wheeler riders, and have bitten three people this month including a child.",
      "An illegal construction has come up overnight on what was a public pathway. The encroachment has blocked the only shortcut used by hundreds of residents to reach the bus stop.",
      "The public toilet near the bus stand is in a deplorable state. There is no water, the doors are broken, it has not been cleaned in weeks, and the stench is unbearable from 50 meters away.",
      "Loudspeakers are being used at very high volume late into the night from a commercial establishment. Despite the noise exceeding permitted limits, no action has been taken.",
      "A large tree fell during last week's storm and is completely blocking the road. Residents have cleared a small gap for two-wheelers but cars and autos cannot pass.",
      "A builder has encroached upon the public playground area by dumping construction material and parking machinery. Children have no space to play in the entire neighborhood.",
      "An old, abandoned building in our area has developed severe cracks and a portion of the wall has already collapsed. It poses an immediate danger to adjacent houses and passersby.",
      "Cars and two-wheelers are permanently parked on the footpath near the market, forcing pedestrians onto the busy main road. Traffic police have been informed but take no action.",
      "A manhole cover on the main road has gone missing. The open manhole is a death trap, especially at night when visibility is low. A temporary barricade we placed keeps getting removed.",
      "The public seating area and garden benches near the lake promenade have been vandalized. Concrete benches are cracked, metal benches have been stolen, and the area is in disarray.",
      "Mosquito fogging was supposed to happen monthly in our ward but has not been done even once this monsoon season. Dengue cases are rising alarmingly in the neighborhood.",
      "The traffic signal at the major junction has been non-functional for 5 days. Without the signal, the junction becomes chaotic during peak hours with near-constant honking and accidents.",
      "The roof of the government primary school is leaking badly. During rain, classrooms flood and children have to sit in wet conditions. Several ceiling tiles have also collapsed.",
      "Large illegal banners and hoardings have been put up at the junction, completely blocking the visibility of the traffic signal and road signs. This is causing accidents.",
      "An abandoned car has been rusting on the public road for over 6 months. It takes up valuable parking space and has become a dumping spot for garbage and a shelter for rodents.",
    ],
  },
};

// ─── Image URLs per category ─────────────────────────────────────────────────
// Using Lorem Picsum (always works, deterministic via seed) + verified Unsplash
// Each category has images that contextually match the issue type.
//
// Strategy: Use picsum.photos/seed/{category-keyword}/800/600 for guaranteed
// working images, plus a few verified Unsplash photos that are known working.

const CATEGORY_IMAGES = {
  "water-supply": [
    "https://picsum.photos/seed/waterpipe1/800/600",
    "https://picsum.photos/seed/waterpipe2/800/600",
    "https://picsum.photos/seed/watersupply1/800/600",
    "https://picsum.photos/seed/watersupply2/800/600",
    "https://picsum.photos/seed/watertank1/800/600",
    "https://picsum.photos/seed/waterpump1/800/600",
    "https://picsum.photos/seed/pipeline1/800/600",
    "https://picsum.photos/seed/pipeline2/800/600",
  ],
  puddle: [
    "https://picsum.photos/seed/puddle1/800/600",
    "https://picsum.photos/seed/puddle2/800/600",
    "https://picsum.photos/seed/flooding1/800/600",
    "https://picsum.photos/seed/flooding2/800/600",
    "https://picsum.photos/seed/drainage1/800/600",
    "https://picsum.photos/seed/drainage2/800/600",
    "https://picsum.photos/seed/waterlog1/800/600",
    "https://picsum.photos/seed/waterlog2/800/600",
  ],
  road: [
    "https://picsum.photos/seed/pothole1/800/600",
    "https://picsum.photos/seed/pothole2/800/600",
    "https://picsum.photos/seed/roadcrack1/800/600",
    "https://picsum.photos/seed/roadcrack2/800/600",
    "https://picsum.photos/seed/roaddamage1/800/600",
    "https://picsum.photos/seed/roaddamage2/800/600",
    "https://picsum.photos/seed/roadwork1/800/600",
    "https://picsum.photos/seed/roadwork2/800/600",
  ],
  garbage: [
    "https://picsum.photos/seed/garbage1/800/600",
    "https://picsum.photos/seed/garbage2/800/600",
    "https://picsum.photos/seed/waste1/800/600",
    "https://picsum.photos/seed/waste2/800/600",
    "https://picsum.photos/seed/trash1/800/600",
    "https://picsum.photos/seed/trash2/800/600",
    "https://picsum.photos/seed/litter1/800/600",
    "https://picsum.photos/seed/litter2/800/600",
  ],
  electricity: [
    "https://picsum.photos/seed/powerline1/800/600",
    "https://picsum.photos/seed/powerline2/800/600",
    "https://picsum.photos/seed/electric1/800/600",
    "https://picsum.photos/seed/electric2/800/600",
    "https://picsum.photos/seed/transformer1/800/600",
    "https://picsum.photos/seed/transformer2/800/600",
    "https://picsum.photos/seed/electricpole1/800/600",
    "https://picsum.photos/seed/electricpole2/800/600",
  ],
  streetlight: [
    "https://picsum.photos/seed/streetlight1/800/600",
    "https://picsum.photos/seed/streetlight2/800/600",
    "https://picsum.photos/seed/lamppost1/800/600",
    "https://picsum.photos/seed/lamppost2/800/600",
    "https://picsum.photos/seed/darkstreet1/800/600",
    "https://picsum.photos/seed/darkstreet2/800/600",
    "https://picsum.photos/seed/nightroad1/800/600",
    "https://picsum.photos/seed/nightroad2/800/600",
  ],
  other: [
    "https://picsum.photos/seed/straydog1/800/600",
    "https://picsum.photos/seed/straydog2/800/600",
    "https://picsum.photos/seed/construction1/800/600",
    "https://picsum.photos/seed/construction2/800/600",
    "https://picsum.photos/seed/traffic1/800/600",
    "https://picsum.photos/seed/traffic2/800/600",
    "https://picsum.photos/seed/manhole1/800/600",
    "https://picsum.photos/seed/manhole2/800/600",
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickN = (arr, n) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

function randomDate(daysAgo) {
  const now = new Date();
  const past = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return new Date(
    past.getTime() + Math.random() * (now.getTime() - past.getTime()),
  );
}

function randomStatus() {
  const r = Math.random();
  if (r < 0.55) return "open";
  if (r < 0.8) return "in-progress";
  return "resolved";
}

// ─── Main ────────────────────────────────────────────────────────────────────

const TOTAL_ISSUES = 100;

async function seed() {
  console.log("🌱 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log("✅ Connected!\n");

  // 1. Find or create seed user
  let user = await User.findOne({ email: "seed@raisevoice.com" });
  if (!user) {
    user = await User.create({
      name: "Seed User",
      email: "seed@raisevoice.com",
      password: "$2a$10$dummyhashedpasswordforseeding1234567890", // not a real login
      role: "user",
      provider: "credentials",
    });
    console.log("👤 Created seed user: seed@raisevoice.com");
  } else {
    console.log("👤 Reusing existing seed user: seed@raisevoice.com");
  }

  // 2. Delete previously seeded issues
  const deleteResult = await Issue.deleteMany({ userId: user._id });
  console.log(
    `🗑️  Deleted ${deleteResult.deletedCount} previously seeded issues\n`,
  );

  // 3. Generate 300 issues
  const categories = Object.keys(ISSUE_DATA);
  const issues = [];

  for (let i = 0; i < TOTAL_ISSUES; i++) {
    const category = categories[i % categories.length]; // even distribution
    const data = ISSUE_DATA[category];

    // Cycle through titles/descriptions, adding variation with the address
    const titleIdx = i % data.titles.length;
    const title = data.titles[titleIdx];
    const description = data.descriptions[titleIdx];
    const status = randomStatus();
    const city = INDIA_CITIES[i % INDIA_CITIES.length];
    const area = city.areas[Math.floor(Math.random() * city.areas.length)];
    const address = `${area}, ${city.name}`;
    const lat = city.lat + jitter();
    const lng = city.lng + jitter();
    const imageCount = 1 + Math.floor(Math.random() * 3); // 1–3 images
    const images = pickN(CATEGORY_IMAGES[category], imageCount);
    const createdAt = randomDate(90);
    const updatedAt =
      status !== "open"
        ? new Date(
            createdAt.getTime() +
              Math.random() * (Date.now() - createdAt.getTime()),
          )
        : createdAt;

    issues.push({
      title,
      description,
      category,
      status,
      location: {
        type: "Point",
        coordinates: [lng, lat], // GeoJSON: [longitude, latitude]
      },
      address,
      images,
      userId: user._id,
      isAnonymous: true,
      createdAt,
      updatedAt,
    });
  }

  // 4. Insert all issues in batches of 100
  console.log(`📝 Inserting ${TOTAL_ISSUES} issues...\n`);
  const BATCH_SIZE = 100;
  for (let i = 0; i < issues.length; i += BATCH_SIZE) {
    const batch = issues.slice(i, i + BATCH_SIZE);
    await Issue.insertMany(batch);
    console.log(
      `   ✓ Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(TOTAL_ISSUES / BATCH_SIZE)} inserted (${Math.min(i + BATCH_SIZE, TOTAL_ISSUES)} / ${TOTAL_ISSUES})`,
    );
  }

  // 5. Print summary
  const statusCount = { open: 0, "in-progress": 0, resolved: 0 };
  const categoryCount = {};
  issues.forEach((issue) => {
    statusCount[issue.status]++;
    categoryCount[issue.category] = (categoryCount[issue.category] || 0) + 1;
  });

  console.log("\n═══════════════════════════════════════════");
  console.log(`  ✅ Successfully seeded ${TOTAL_ISSUES} issues!`);
  console.log("═══════════════════════════════════════════\n");

  console.log("📊 Status breakdown:");
  console.log(`   🔴 Open:        ${statusCount["open"]}`);
  console.log(`   🟡 In Progress: ${statusCount["in-progress"]}`);
  console.log(`   🟢 Resolved:    ${statusCount["resolved"]}\n`);

  console.log("📂 Category breakdown:");
  Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      const emoji = {
        "water-supply": "💧",
        puddle: "🌊",
        road: "🛣️",
        garbage: "🗑️",
        electricity: "⚡",
        streetlight: "💡",
        other: "📝",
      }[cat];
      console.log(`   ${emoji} ${cat.padEnd(14)} ${count}`);
    });

  console.log(
    `\n🎯 ${TOTAL_ISSUES} issues distributed across ${INDIA_CITIES.length} cities in India`,
  );
  console.log(`🔗 Open ${NEXT_PUBLIC_APP_URL} to see them!\n`);

  await mongoose.disconnect();
  console.log("📡 Disconnected from MongoDB. Done!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
