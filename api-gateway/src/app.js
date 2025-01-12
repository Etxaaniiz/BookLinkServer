const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const { expressjwt: jwt } = require("express-jwt");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path"); 
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Cargar Swagger desde `src/swagger.yaml`
const swaggerDocument = YAML.load(path.resolve(__dirname, "swagger.yaml"));

// Registrar la documentación en `/api-docs`
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_secreta_segura";

// 1️⃣ Definir rutas públicas ANTES del middleware JWT**
const SERVICES = {
    auth: "http://localhost:5000/auth",
    favorites: "http://localhost:5000/favorites",
    details: "http://localhost:5000/api/details",
    search: "http://localhost:4000/search"
};

// **Función para redirigir peticiones a los microservicios**
const proxyRequest = async (req, res, targetUrl) => {
  if (!targetUrl) {
      console.error("❌ ERROR: `targetUrl` está indefinido en proxyRequest.");
      return res.status(500).json({ error: "Error en API Gateway: URL no definida" });
  }

  try {
      console.log(`🔁 Redirigiendo solicitud ${req.method} a ${targetUrl} con params:`, req.query);

      const response = await axios({
          method: req.method,
          url: targetUrl,  // ✅ Se asegura que `targetUrl` es válido
          params: req.query,  // ✅ Enviar parámetros correctamente
          headers: req.headers
      });

      res.status(response.status).json(response.data);
  } catch (error) {
      console.error(`❌ Error en API Gateway (${req.method} ${targetUrl}):`, error.response?.data || error.message);
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
        { url: "/search", methods: ["GET"] }, 
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

app.use("/search", (req, res) => proxyRequest(req, res, SERVICES.search));

// Exportar la instancia de app sin ejecutar .listen()
module.exports = app;
