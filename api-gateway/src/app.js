const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const { expressjwt: jwt } = require("express-jwt");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_secreta_segura";

// 1️⃣ Definir rutas públicas ANTES del middleware JWT**
const SERVICES = {
    auth: "http://localhost:5000/auth",
    favorites: "http://localhost:5000/favorites",
    details: "http://localhost:5000/api/details",
    books: "http://localhost:4001/search"
};

// **Función para redirigir peticiones a los microservicios**
const proxyRequest = async (req, res, targetUrl) => {
  try {
      const headers = {
          "Content-Type": "application/json",
          Authorization: req.headers.authorization || "", // ✅ Mantener JWT si existe
      };

      console.log(`🔁 Reenviando solicitud ${req.method} a ${targetUrl} con headers:`, headers);

      const response = await axios({
          method: req.method,
          url: targetUrl,
          data: req.body,
          headers: headers,
      });

      res.status(response.status).json(response.data);
  } catch (error) {
      console.error(`❌ Error en API Gateway (${req.method} ${targetUrl}):`, error.message);
      res.status(error.response?.status || 500).json(error.response?.data || { error: "Error en API Gateway" });
  }
};

// **🔵 Permitir acceso sin autenticación a /auth/login y /auth/register**
app.post("/auth/login", (req, res) => proxyRequest(req, res, `${SERVICES.auth}/login`));
app.post("/auth/register", (req, res) => proxyRequest(req, res, `${SERVICES.auth}/register`));

app.use((req, res, next) => {
  console.log(`📥 Solicitud recibida: ${req.method} ${req.originalUrl}`);
  next();
});

// 🚀 **2️⃣ Middleware de autenticación JWT (Aplicado después de rutas públicas)**
app.use(jwt({
    secret: JWT_SECRET,
    algorithms: ["HS256"]
}).unless({
    path: [
        { url: "/auth/login", methods: ["POST"] },
        { url: "/auth/register", methods: ["POST"] },
        { url: /^\/details\/.*/, methods: ["GET"] },
    ],
}));



// **3️⃣ Definir las rutas protegidas (solo accesibles con JWT)**
app.use("/auth", (req, res) => proxyRequest(req, res, SERVICES.auth));

app.delete("/favorites/:id", (req, res) => {
  const favoriteId = req.params.id;

  if (!favoriteId) {
    console.error("🚨 ERROR: No se recibió un ID en la solicitud DELETE.");
    return res.status(400).json({ error: "Falta el ID del favorito en la URL." });
  }

  console.log(`🗑️ Eliminando favorito con ID: ${favoriteId}`); 

  proxyRequest(req, res, `${SERVICES.favorites}/${favoriteId}`);
});

// Ahora sí definimos `app.use("/favorites")` después
app.use("/favorites", (req, res) => proxyRequest(req, res, SERVICES.favorites));

app.use("/details/:bookId", (req, res) => {
  const bookId = req.params.bookId;
  proxyRequest(req, res, `${SERVICES.details}/${bookId}`);
});

app.use("/books", (req, res) => proxyRequest(req, res, SERVICES.books));

// Exportar la instancia de app sin ejecutar .listen()
module.exports = app;
