import { Router } from "express";
import { avistamientoModel } from "../models/Avistamiento.js";

const router = Router();


const esFormulario = (req) => req.headers["content-type"]?.includes("application/x-www-form-urlencoded");


const responder = (req, res, status, data) => {
    if (esFormulario(req)) {
        return res.redirect(status < 400 ? "/" : "/?error=" + encodeURIComponent(data.message));
    }
    res.status(status).send(data);
};


const responderError = (req, res, error) => {
    let status = 500; 
    let message = error.message;
    if (error.name === "ValidationError") {
        status = 400;
        message = Object.values(error.errors).map((e) => e.message).join(" | ");
    } else if (error.name === "CastError") { 
        status = 400;
        message = `Formato inválido en '${error.path}': ${error.value}`;
    }
    responder(req, res, status, { status: "error", message });
};

const noEncontrado = { status: "error", message: "Avistamiento no encontrado" };

// GET /api/avistamientos  |  GET /api/avistamientos?categoria=Ave
router.get("/", async (req, res) => {
    const { categoria } = req.query;
    const filtro = categoria ? { categoria } : {};
    try {
        const result = await avistamientoModel.find(filtro).sort({ fechaRegistro: -1 }); // más reciente primero
        res.status(200).send({ status: "success", data: result });
    } catch (error) {
        responderError(req, res, error);
    }
});

// POST /api/avistamientos 
router.post("/", async (req, res) => {
    const newAvistamiento = req.body ?? {}; 
    try {
        const result = await avistamientoModel.create(newAvistamiento);
        responder(req, res, 201, result);
    } catch (error) {
        responderError(req, res, error);
    }
});

// Solo se actualizan la zona y el estado de conservación
const actualizar = async (req, res) => {
    const { zona, estadoConservacion } = req.body ?? {};
    try {
        const result = await avistamientoModel.findByIdAndUpdate(
            req.params.id,
            { zona, estadoConservacion }, 
            { returnDocument: "after", runValidators: true } 
        );
        if (!result) return responder(req, res, 404, noEncontrado);
        responder(req, res, 200, { status: "success", data: result });
    } catch (error) {
        responderError(req, res, error);
    }
};

const eliminar = async (req, res) => {
    try {
        const result = await avistamientoModel.findByIdAndDelete(req.params.id);
        if (!result) return responder(req, res, 404, noEncontrado);
        responder(req, res, 200, { status: "success", message: "Avistamiento eliminado", data: result });
    } catch (error) {
        responderError(req, res, error);
    }
};

// Postman usa PUT/DELETE
router.put("/:id", actualizar);
router.post("/update/:id", actualizar);
router.delete("/:id", eliminar);
router.post("/delete/:id", eliminar);

export default router;
