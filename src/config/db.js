import mongoose from "mongoose";


export const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: "biocaqueta_db" });
        console.log("Conectados a la BBDD 'biocaqueta_db' en MongoDB Atlas");
    } catch (error) {
        console.log("NO FUE POSIBLE LA CONEXIÓN: " + error);
    }
};
