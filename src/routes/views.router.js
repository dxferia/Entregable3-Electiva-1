import { Router } from "express";
import { avistamientoModel, categorias, estadosConservacion } from "../models/Avistamiento.js";

const router = Router();




router.get("/", async (req, res) => {
    const vista = { title: "BioCaquetá", categorias, estadosConservacion, error: req.query.error };
    try {
        vista.avistamientos = await avistamientoModel.find().sort({ fechaRegistro: -1 }).lean();
        res.render("home", vista);
    } catch (error) {
        vista.error = "No fue posible consultar los avistamientos: " + error.message;
        res.status(500).render("home", vista);
    }
});

// GET /editar/:id
router.get("/editar/:id", async (req, res) => {
    try {
        const avistamiento = await avistamientoModel.findById(req.params.id).lean();
        if (!avistamiento) return res.redirect("/?error=" + encodeURIComponent("Avistamiento no encontrado"));
        res.render("editar", { title: "Editar avistamiento", avistamiento, estadosConservacion });
    } catch (error) {
        res.redirect("/?error=" + encodeURIComponent("Identificador inválido: " + req.params.id));
    }
});

export default router;
