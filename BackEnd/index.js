import e from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import databaseConnection from "./config/database.js";
import userRouter from "./routes/user.routes.js";
import tweetRouter from "./routes/tweet.routes.js"
import cors from "cors"

dotenv.config({
    path: ".env"
})

const app = e()
const port = process.env.PORT || 3000

databaseConnection();
//middlewares
app.use(e.urlencoded({
    extended: true
}));
app.use(e.json())
app.use(cookieParser())
const corsOption = {
    origin:"http://localhost:5173",
    credentials:true
}
app.use(cors(corsOption));

//API
app.use("/api/v1/user", userRouter);
app.use("/api/v1/tweet",tweetRouter)


app.listen(port, () => {
    console.log(`Server is listeing at ${port}`);
})