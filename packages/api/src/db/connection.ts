import mongoose, { Mongoose } from "mongoose";

type DBCache = {
    mongoose: {
        connection: Mongoose | null;
        promise?: Promise<Mongoose>;
    };
};

const dbCache: DBCache = {
    mongoose: {
        connection: null,
    },
};

let cached = dbCache.mongoose;

if (!cached) {
    cached = dbCache.mongoose = { connection: null };
}

export async function dbConnect() {
    if (cached.connection) {
        return cached.connection;
    }

    if (!cached.promise) {
        const MONGODB_URI = process.env.MONGODB_URI;

        if (!MONGODB_URI) {
            throw new Error("Please define the MONGODB_URI environment variable");
        }

        cached.promise = mongoose
            .connect(MONGODB_URI, {
                bufferCommands: false,
                serverSelectionTimeoutMS: 5000
            })
    }

    cached.connection = await cached.promise;
    return cached.connection;
}