export class FoodRating {
    rate(foods, ingredients) {
        return foods
            .filter(food => ingredients.every(ingredient => {
                return food.ingredients.includes(ingredient);
            }))
            .map(food => ({
                food,
                rating: ingredients.length / food.ingredients.length
            }))
            .sort((a, b) => (b.rating - a.rating));
    }
}

export class Food {
    constructor(name, ingredients) {
        this.name = name;
        this.ingredients = ingredients;
    }
}