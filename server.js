import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import routers from "./routes/userRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/register", (req, res) => {
res.send("eCommerce API is running!");
});


app.use("/api", routers)

const PORT = process.env.PORT || 5000;

connectDB().finally(() => {
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
});




