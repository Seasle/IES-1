import { Food } from './food.js';
import { createAutoEnum } from './utils.js';

export const Ingredients = createAutoEnum();
export const Foods = [
    new Food('Яичница', [
        Ingredients['Яйца'],
        Ingredients['Соль']
    ]),
    new Food('Яичница c зеленью', [
        Ingredients['Яйца'],
        Ingredients['Соль'],
        Ingredients['Зелень']
    ]),
    new Food('Блины', [
        Ingredients['Яйца'],
        Ingredients['Мука'],
        Ingredients['Соль'],
        Ingredients['Сахар'],
        Ingredients['Вода']
    ])
];