/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import {
  allPass,
  compose,
  gt,
  ifElse,
  length,
  lt,
  mathMod,
  prop,
  test,
  __,
  andThen,
  tap,
} from "ramda";
import Api from "../tools/api";

const api = new Api();

const isLengthValid = allPass([
  compose(lt(__, 10), length),
  compose(gt(__, 2), length),
]);
const isPositive = compose(gt(__, 0), parseFloat);
const isNumber = test(/^[0-9.]+$/);
const isValidNumber = allPass([isLengthValid, isPositive, isNumber]);

const roundToNumber = compose(Math.round, parseFloat);
const toBinary = (number) =>
  api.get("https://api.tech/numbers/base", {
    from: 10,
    to: 2,
    number: number.toString(),
  });
const getAnimal = (id) => api.get(`https://animals.tech/${id}`, {});

const processBinaryResult = (binaryString) => length(binaryString);
const square = (x) => x ** 2;
const remainderBy3 = (x) => mathMod(x, 3);

const logAndReturn = (writeLog) => tap(writeLog);
const extractResult = prop("result");

const processValue = ({ writeLog, handleSuccess, handleError }) =>
  compose(
    andThen(handleSuccess),
    andThen(logAndReturn(writeLog)),
    andThen(extractResult),
    andThen(getAnimal),
    andThen(logAndReturn(writeLog)),
    andThen(remainderBy3),
    andThen(logAndReturn(writeLog)),
    andThen(square),
    andThen(logAndReturn(writeLog)),
    andThen(processBinaryResult),
    andThen(logAndReturn(writeLog)),
    andThen(extractResult),
    andThen(toBinary),
    andThen(logAndReturn(writeLog)),
    async (val) => Promise.resolve(roundToNumber(val))
  );

const validateAndProcess = ({ value, writeLog, handleSuccess, handleError }) =>
  ifElse(
    isValidNumber,
    processValue({ writeLog, handleSuccess, handleError }),
    () => handleError("ValidationError")
  )(value);

const processSequence = (params) => {
  const { value, writeLog } = params;
  writeLog(value);
  validateAndProcess(params);
};

export default processSequence;
