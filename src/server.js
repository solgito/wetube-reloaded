import express from "express";
import morgan from "morgan";

const PORT = 4000;

const app = express();

const logger = morgan("dev");
app.use(logger);

const handleHome = (req, res) => {
    return res.send("I love middlewares");
};

app.get("/", handleHome);

const handleLogin = (req, res) => {
    return res.send(`Login here.`);
};

app.get("/login", handleLogin);

const handleListening = () => console.log(`Server is listening on port http://localhost:${PORT}🐈`);

app.listen(PORT, handleListening);