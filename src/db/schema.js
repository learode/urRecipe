// Favorites table
    // id 
    // user_id
    // recipe_id
    // title
    // image
    // cook_time
    // servings
    // created_at

// Postgres database is an sql table thus creates table not document like mongodb

// drixxle-orm - communicating with database, creating, deleting, etc
// drizzle-kit - applying changes to the main database on the cloud.

import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const favoritesTable = pgTable("favorites", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    recipeId: integer("recipe_id").notNull(),
    title: text("title").notNull(),
    image: text("image"),
    cookTime: text("cook_time"),
    servings: text("servings"),
    createdAt: timestamp("created_at").defaultNow(),
})