import "dotenv/config"; // carga MONGO_URI y PORT desde .env
import express from "express";
import { engine } from "express-handlebars";
import { conectarDB } from "./config/db.js";
import apiRouter from "./routes/api.router.js";
import viewsRouter from "./routes/views.router.js";

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(import.meta.dirname + "/public")); 


app.engine("handlebars", engine({
    helpers: {
        fecha: (valor) => new Date(valor).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" }),
        seleccionado: (opcion, actual) => (opcion === actual ? "selected" : "")
    }
}));
app.set("views", import.meta.dirname + "/views"); 
app.set("view engine", "handlebars");

// Enrutadores
app.use("/api/avistamientos", apiRouter);
app.use("/", viewsRouter);

conectarDB();

app.listen(port, () => {
    console.log(`BioCaquetá escuchando en http://localhost:${port}`);
});
