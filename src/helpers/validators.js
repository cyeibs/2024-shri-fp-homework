/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

// 1. Красная звезда, зеленый квадрат, все остальные белые.

import {
  allPass,
  equals,
  propSatisfies,
  filter,
  gte,
  length,
  countBy,
  isEmpty,
  omit,
  identity,
  compose,
  not,
  __,
} from "ramda";

// Определение предикатов
const isRed = equals("red");
const isGreen = equals("green");
const isWhite = equals("white");
const isBlue = equals("blue");
const isOrange = equals("orange");

// Вспомогательные функции
const countColors = countBy(identity);
const omitWhite = omit(["white"]);
const filterGreen = filter(isGreen);
const filterRed = filter(isRed);
const filterBlue = filter(isBlue);

export const validateFieldN1 = ({ star, square, triangle, circle }) =>
  allPass([
    propSatisfies(isRed, "star"),
    propSatisfies(isGreen, "square"),
    propSatisfies(isWhite, "triangle"),
    propSatisfies(isWhite, "circle"),
  ])({ star, square, triangle, circle });

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = ({ star, square, triangle, circle }) =>
  compose(
    gte(__, 2), // Используем placeholder для корректного сравнения
    length,
    filterGreen
  )([star, square, triangle, circle]);
// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = ({ star, square, triangle, circle }) =>
  equals(
    compose(length, filterRed)([star, square, triangle, circle]),
    compose(length, filterBlue)([star, square, triangle, circle])
  );
// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = ({ star, square, triangle, circle }) =>
  allPass([
    propSatisfies(isRed, "star"),
    propSatisfies(isOrange, "square"),
    propSatisfies(isBlue, "circle"),
  ])({ star, square, triangle, circle });

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = ({ star, square, triangle, circle }) =>
  compose(
    not,
    isEmpty,
    filter(gte(__, 3)),
    omitWhite,
    countColors
  )([star, square, triangle, circle]);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = ({ star, square, triangle, circle }) =>
  allPass([
    ({ star, square, triangle, circle }) =>
      compose(equals(2), length, filterGreen)([star, square, triangle, circle]),
    propSatisfies(isGreen, "triangle"),
    ({ star, square, triangle, circle }) =>
      compose(equals(1), length, filterRed)([star, square, triangle, circle]),
  ])({ star, square, triangle, circle });
// 7. Все фигуры оранжевые.
export const validateFieldN7 = ({ star, square, triangle, circle }) =>
  allPass([
    propSatisfies(isOrange, "star"),
    propSatisfies(isOrange, "square"),
    propSatisfies(isOrange, "triangle"),
    propSatisfies(isOrange, "circle"),
  ])({ star, square, triangle, circle });
// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = ({ star, square, triangle, circle }) =>
  allPass([compose(not, isRed), compose(not, isWhite)])(star);
// 9. Все фигуры зеленые.
export const validateFieldN9 = ({ star, square, triangle, circle }) =>
  allPass([
    propSatisfies(isGreen, "star"),
    propSatisfies(isGreen, "square"),
    propSatisfies(isGreen, "triangle"),
    propSatisfies(isGreen, "circle"),
  ])({ star, square, triangle, circle });
// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = ({ star, square, triangle, circle }) =>
  allPass([
    ({ square, triangle }) => equals(square, triangle),
    propSatisfies(compose(not, isWhite), "square"),
  ])({ star, square, triangle, circle });
