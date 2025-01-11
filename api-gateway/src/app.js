const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const { expressjwt: jwt } = require("express-jwt");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:3000", // Permitir solicitudes desde el frontend
}));

// Configurar JWT Middleware
const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_secreta_segura";
app.use(
    jwt({ secret: JWT_SECRET, algorithms: ["HS256"] }).unless({
        path: ["/auth/login", "/auth/register"], // Permitir acceso sin autenticación
    })
);

// URLs de los microservicios
const SERVICES = {
    auth: "http://localhost:5000/auth",
    favorites: "http://localhost:5000/favorites",
    details: "http://localhost:5000/api/details",
    books: "http://localhost:4001/search"
};

// Función para redirigir peticiones a los microservicios
const proxyRequest = async (req, res, targetUrl) => {
    try {
        const response = await axios({
            method: req.method,
            url: `${targetUrl}${req.url}`,
            data: req.body,
            headers: req.headers
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error(`Error en API Gateway: ${error.message}`);
        res.status(error.response?.status || 500).json(error.response?.data || { error: "Error en API Gateway" });
    }
};

// **Rutas en el API Gateway**
app.use("/auth", (req, res) => proxyRequest(req, res, SERVICES.auth));
app.use("/favorites", (req, res) => proxyRequest(req, res, SERVICES.favorites));
app.use("/details", (req, res) => proxyRequest(req, res, SERVICES.details));
app.use("/books", (req, res) => proxyRequest(req, res, SERVICES.books));

// Servidor API Gateway
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`✅ API Gateway corriendo en http://localhost:${PORT}`);
});
