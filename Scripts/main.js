import { FoodRating } from './food.js';
import { Foods, Ingredients } from './store.js';

const rating = new FoodRating();

const question = document.querySelector('[data-question]');
const containers = new Map(
    [...document.querySelectorAll('[data-container]')].map(entry => [entry.dataset.container, entry])
);
const controls = new Map(
    [...document.querySelectorAll('[data-control]')].map(entry => [entry.dataset.control, entry])
);

const store = {
    keys: [],
    ingredients: [],
    picked: null
};

const bind = () => {
    controls.get('debug').addEventListener('input', event => {
        if (event.target.checked) {
            location.hash = 'debug';
        } else {
            location.hash = '';
        }
    });

    controls.get('yes').addEventListener('click', event => {
        event.preventDefault();

        store.ingredients.push(Ingredients[store.picked]);
        update();
    });

    controls.get('no').addEventListener('click', event => {
        event.preventDefault();

        update();
    });

    controls.get('restart').addEventListener('click', event => {
        event.preventDefault();

        start();
        update();
    });
};

const start = () => {
    store.keys = Object.keys(Ingredients);
    store.ingredients = [];
};

const update = () => {
    if (store.keys.length > 0) {
        store.picked = store.keys[Math.floor(Math.random() * store.keys.length)];
        store.keys = store.keys.filter(ingredient => (ingredient !== store.picked));

        containers.get('buttons').removeAttribute('hidden');
        containers.get('done').setAttribute('hidden', true);
        question.textContent = `В блюде есть ингредиент - ${store.picked}?`;
    } else {
        containers.get('buttons').setAttribute('hidden', true);
        containers.get('done').removeAttribute('hidden');
        question.textContent = `Ингредиенты закончились`;
    }

    const foods = rating
        .rate(Foods, store.ingredients)
        .map(entry => ({
            ...entry,
            food: {
                ...entry.food,
                ingredients: entry.food.ingredients.reduce((accumulator, ingredient) => {
                    const entry = Object.entries(Ingredients).find(([key, value]) => (value === ingredient));
                    accumulator.push(entry[0]);

                    return accumulator;
                }, [])
            }
        }));

    containers.get('debug').textContent = JSON.stringify(foods, null, '\t');
};

const view = () => {
    if (location.hash === '#debug') {
        containers.get('debug').removeAttribute('hidden');
    } else {
        containers.get('debug').setAttribute('hidden', true);
    }
};

window.addEventListener('DOMContentLoaded', () => {
    bind();
    start();
    update();
    view();

    window.addEventListener('click', () => {
        if (!document.fullscreen) {
            document.body.requestFullscreen();
        }
    });

    window.addEventListener('hashchange', () => {
        view();
    });
});