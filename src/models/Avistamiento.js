import mongoose from "mongoose";

const avistamientoCollection = "avistamientos";


export const categorias = ["Mamífero", "Ave", "Reptil", "Anfibio", "Flora"];
export const estadosConservacion = ["Preocupación menor", "Vulnerable", "En peligro"];

const avistamientoSchema = new mongoose.Schema({
    nombreComun: {
        type: String,
        required: [true, "El nombre común es obligatorio"],
        trim: true
    },
    nombreCientifico: {
        type: String,
        required: [true, "El nombre científico es obligatorio"],
        trim: true
    },
    categoria: {
        type: String,
        required: [true, "La categoría es obligatoria"],
        enum: { values: categorias, message: "La categoría '{VALUE}' no es válida" }
    },
    zona: {
        type: String,
        required: [true, "La zona es obligatoria"],
        trim: true
    },
    estadoConservacion: {
        type: String,
        enum: { values: estadosConservacion, message: "El estado de conservación '{VALUE}' no es válido" },
        default: "Preocupación menor"
    },
    investigador: {
        type: String,
        required: [true, "El investigador es obligatorio"],
        trim: true
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    }
});

export const avistamientoModel = mongoose.model(avistamientoCollection, avistamientoSchema);
