const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connection Successful!"))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

// 12 UNIQUE Products (Duplicates removed, Descriptions added)
const products = [
    { 
      name: "TURMERIC POWDER", 
      desc: "Pure, vibrant turmeric powder rich in curcumin. Essential for every kitchen.",
      img: "/images/Products/Turmeric_Powder.png", 
      category: "KITCHEN ESSENTIALS", 
      color: "#7ed957", 
      price: 250 
    },
    { 
      name: "MIRCH POWDER", 
      desc: "Spicy and vibrant red chilli powder made from premium dried chillies.",
      img: "/images/Products/Mirch_Powder.png", 
      category: "KITCHEN ESSENTIALS", 
      color: "#ffcc00", 
      price: 280 
    },
    { 
      name: "DHANIA POWDER", 
      desc: "Aromatic coriander powder that adds a mild flavor and aroma to sweet and savory food.",
      img: "/images/Products/Dhania_Powder.png", 
      category: "KITCHEN ESSENTIALS", 
      color: "#f9c6a6", 
      price: 220 
    },
    { 
      name: "JEERA", 
      desc: "Whole cumin seeds with a warm, earthy flavor. A staple spice.",
      img: "/images/Products/Jeera.png", 
      category: "SPICES", // Consolidated Category
      color: "#8b4513", 
      price: 400 
    },
    { 
      name: "DHANIA", 
      desc: "Whole coriander seeds, perfect for roasting and grinding fresh.",
      img: "/images/Products/Dhania.png", 
      category: "SPICES", 
      color: "#ffd700", 
      price: 200 
    },
    { 
      name: "SARSO", 
      desc: "High-quality mustard seeds for tadka and pickling.",
      img: "/images/Products/Sarso.png", 
      category: "SPICES", 
      color: "#ff4500", 
      price: 90 
    },
    { 
      name: "BLACK PEPPER", 
      desc: "The King of Spices. bold, pungent whole black peppercorns.",
      img: "/images/Products/BlackPepper.png", 
      category: "SPICES", 
      color: "#ff0000", 
      price: 650 
    },
    { 
      name: "GOLKI POWDER", 
      desc: "Finely ground black pepper powder for instant heat and flavor.",
      img: "/images/Products/Golki_Powder.png", 
      category: "SPICES", 
      color: "#d9534f", 
      price: 700 
    },
    { 
      name: "CHATT MASALA", 
      desc: "Tangy spice blend perfect for fruits, snacks, and salads.",
      img: "/images/Products/Chatt_Masala.png", 
      category: "BLENDED MASALAS", 
      color: "#ff7043", 
      price: 150 
    },
    { 
      name: "SABJI MIX", 
      desc: "A perfect blend of spices to enhance the taste of your daily vegetables.",
      img: "/images/Products/Sabji_Mix.png", 
      category: "BLENDED MASALAS", 
      color: "#ffcc33", 
      price: 160 
    },
    { 
      name: "SENDHA NAMAK", 
      desc: "Pure rock salt, ideal for fasting and daily healthy consumption.",
      img: "/images/Products/Sendha_namak.png", 
      category: "SALTS", 
      color: "#ff69b4", 
      price: 40 
    },
    { 
      name: "KALA NAMAK", 
      desc: "Black salt with a distinctive savory, sulfurous flavor.",
      img: "/images/Products/Kala_namak.png", 
      category: "SALTS", 
      color: "#8b0000", 
      price: 45 
    },
];

const seedDB = async () => {
  try {
    await Product.deleteMany({});
    console.log("Old products cleared...");

    await Product.insertMany(products);
    console.log("✅ 12 Unique Products Seeded Successfully!");

    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

seedDB();