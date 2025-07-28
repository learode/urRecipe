import express from "express";
import { ENV } from "./config/env.js";

import { db } from "./config/db.js";
import { favoritesTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";

const app = express();
const PORT = ENV.PORT || 8001;

app.use(express.json()); // to query req.body as json

app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "OK", status: 200 });
});

const api = '/api/favorites'

app.get(api+"/:userId/", async (req, res) => {
    try {
        const { userId } = req.params;

        const favs = await db.select()
                .from(favoritesTable)
                .where(
                    eq(favoritesTable.userId, userId), // don't forget the comma 
                );
                // .orderBy(desc(favoritesTable.createdAt));

        res.status(200).json(favs);
    } catch (error) {
        res.status(500).json({
            error: "Error fetching favorites",
        })
    }
})

app.post(api, async (req, res) => {

    try {
        const { userId, recipeId, title, image, cookTime, servings } = req.body;

        if (!userId || !recipeId) {
            return res.status(400).json({
                error: "Missing required fields"
            })
        }

        const newFavorites = await db.insert(favoritesTable).values({
            userId, 
            recipeId, 
            title,
            image,
            cookTime,
            servings,
        })
        .returning();

        res.status(201).json(newFavorites[0]);
    } catch (error) {
        res.status(500).json({
            error: "Internal Server Error"
        })
    }
})


app.delete(`${api}/:userId/:recipeId`, async (req, res) => {
    try {
        const { userId, recipeId } = req.params;

        await db.delete(favoritesTable)
            .where(
                and(
                    eq(favoritesTable.userId, userId),
                    eq(favoritesTable.recipeId, parseInt(recipeId)),
                )
            );

            res.status(200).json({
                message: "Favorite removed successfully"
            });
        
    } catch (error) {
        res.status(500).json({
            error: "Failed to remove favorite, something went wrong",
        })
    }
})


app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})