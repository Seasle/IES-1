import { Food, FoodRating } from './food.js';
import { createAutoEnum, render, round, load } from './utils.js';

const Ingredients = createAutoEnum();
const Foods = [];
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

    controls.get('debug').checked = location.hash === '#debug';
};

const start = () => {
    store.keys = Object.keys(Ingredients);
    store.ingredients = [];
};

const fill = foods => {
    const container = containers.get('result');

    container.innerHTML = '';

    if (store.ingredients.length > 0 && foods.length > 0) {
        for (const entry of foods) {
            const percent = round(entry.rating * 100, 2);
            const element = render('div', { className: 'item', 'data-percent': percent }, [
                render('p', {
                    className: 'item__name',
                    textContent: entry.food.name
                }),
                render('span', {
                    className: 'item__rating',
                    textContent: `${percent}%`
                })
            ]);

            container.append(element);
        }
    } else {
        if (store.ingredients.length > 0) {
            question.textContent = `У нас нету блюда с такими ингредиентами`;

            containers.get('buttons').setAttribute('hidden', true);
            containers.get('done').removeAttribute('hidden');
        }
    }
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

    fill(foods);
    containers.get('debug').textContent = JSON.stringify({
        store: {
            keys: store.keys,
            ingredients: store.ingredients.reduce((accumulator, ingredient) => {
                const entry = Object.entries(Ingredients).find(([key, value]) => (value === ingredient));
                accumulator.push(entry[0]);

                return accumulator;
            }, []),
            picked: store.picked
        },
        foods
    }, null, '\t');
};

const view = () => {
    if (location.hash === '#debug') {
        containers.get('debug').removeAttribute('hidden');
    } else {
        containers.get('debug').setAttribute('hidden', true);
    }
};

load('./Data/foods.json').then(data => {
    for (const entry of data) {
        const food = new Food(entry.name, entry.ingredients.map(name => Ingredients[name]));

        Foods.push(food);
    }

    bind();
    start();
    update();
    view();

    window.addEventListener('hashchange', () => {
        view();
    });

    const loader = containers.get('loader');

    const loaderHandler = () => {
        loader.removeEventListener('animationend', loaderHandler);

        loader.remove();
    }

    loader.classList.add('loader--hide');
    loader.addEventListener('animationend', loaderHandler);
});