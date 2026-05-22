// Run with: npm run seed
// Inserts an admin user + demo products so you can play with the app immediately.

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Product = require("../models/Product");

const products = [
  {
    name: "Wireless Headphones",
    description: "Comfortable over-ear headphones with deep bass.",
    price: 79.99,
    oldPrice: 99.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=600",
    stock: 25,
    isFeatured: true,
  },
  {
    name: "Smart Watch",
    description: "Fitness tracking, notifications and a 7-day battery.",
    price: 129.0,
    oldPrice: 159.0,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600",
    stock: 18,
    isFeatured: true,
  },
  {
    name: "Classic Sneakers",
    description: "All-day comfort with a timeless look.",
    price: 59.5,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    stock: 40,
    isFeatured: true,
  },
  {
    name: "Leather Backpack",
    description: "Durable leather backpack with laptop pocket.",
    price: 89.0,
    oldPrice: 120.0,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
    stock: 12,
  },
  {
    name: "Coffee Maker",
    description: "Brew your favorite coffee in minutes.",
    price: 45.0,
    category: "Home",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600",
    stock: 30,
    isFeatured: true,
  },
  {
    name: "Desk Lamp",
    description: "Adjustable LED desk lamp with USB port.",
    price: 24.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600",
    stock: 50,
  },
  {
    name: "Yoga Mat",
    description: "Non-slip yoga mat for daily practice.",
    price: 19.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600",
    stock: 60,
  },
  {
    name: "Running Shoes",
    description: "Lightweight running shoes for everyday training.",
    price: 74.0,
    oldPrice: 99.0,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    stock: 22,
    isFeatured: true,
  },
];

(async () => {
  await connectDB();
  console.log("Clearing existing data...");
  await Product.deleteMany();
  await User.deleteMany();

  console.log("Creating admin and user accounts...");
  await User.create({
    name: "Admin",
    email: "admin@shop.com",
    password: "admin123",
    isAdmin: true,
  });
  await User.create({
    name: "Demo User",
    email: "user@shop.com",
    password: "user123",
  });

  console.log("Inserting demo products...");
  await Product.insertMany(products);

  console.log("Done! Login: admin@shop.com / admin123");
  await mongoose.disconnect();
  process.exit(0);
})();
