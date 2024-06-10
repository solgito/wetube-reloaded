import express from "express";

const PORT = 4000;

const app = express();

app.get("/", (req, res) => {
    return res.send(`<h1>I still love you.<h1>`);
});

const handleLogin = (req, res) => {
    return res.send(`Login here.`);
};

app.get("/login", handleLogin);

const handleListening = () => console.log(`Server is listening on port http://localhost:${PORT}🐈`);

app.listen(PORT, handleListening);