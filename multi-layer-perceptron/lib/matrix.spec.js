import sinon from 'sinon';
import test from 'ava';

import Matrix from './matrix';

test('Matrix constructor', (t) => {
	const matrix = new Matrix(3, 4);

	t.is(matrix.rowCount, 3);
	t.is(matrix.columnCount, 4);
	t.is(matrix.data.length, matrix.rowCount * matrix.columnCount);

	t.throws(() => new Matrix(0, 1));
	t.throws(() => new Matrix(1, 0));
});

test('Matrix.add', (t) => {
	const a = new Matrix(3, 4).map(n => 2);
	const b = new Matrix(3, 4).map(n => 3);

	t.is(a.add(b).get(0, 0), 5);

	t.notThrows(() => new Matrix(3, 4).add(new Matrix(3, 4)));
	t.throws(() => new Matrix(3, 4).add(new Matrix(4, 3)));
});

test('Matrix.clone', (t) => {
	const matrix = new Matrix(3, 4).randomize();
	const clone = matrix.clone();

	t.false(matrix === clone);
	t.deepEqual(matrix, clone);
});

test('Matrix.get', (t) => {
	const matrix = new Matrix(3, 4).map((n, r, c) => r * c);
	
	t.is(matrix.get(0, 0), 0);
	t.is(matrix.get(2, 3), 6);

	t.throws(() => matrix.get(-1, 0));
	t.throws(() => matrix.get(0, -1));
	t.throws(() => matrix.get(3, 0));
	t.throws(() => matrix.get(0, 4));
});

test('Matrix.forEach', (t) => {
	const matrix = new Matrix(3, 4);
	const spy = sinon.spy();

	matrix.forEach(spy);

	t.is(spy.callCount, 3 * 4);
	t.true(spy.calledWithExactly(0, 0, 0, 0));
});

test('Matrix.map', (t) => {
	const matrix = new Matrix(3, 4);
	const spy = sinon.spy((n, r, c, i) => i);

	matrix.map(spy);

	t.is(matrix.data[4], 4);
	t.is(spy.callCount, 3 * 4);
	t.true(spy.calledWithExactly(0, 0, 0, 0));
});

test('Matrix.multiplyScalar', (t) => {
	const matrix = new Matrix(3, 4).map((n, r, c, i) => i);
	matrix.multiplyScalar(2);

	t.is(matrix.data[4], 8);

	t.throws(() => matrix.multiplyScalar(NaN));
});

test('Matrix.randomize', (t) => {
	const matrix = new Matrix(3, 4).randomize();
	const value = matrix.get(1, 1);
	
	t.true(value >= -1 && value < 1);
});

test('Matrix.set', (t) => {
	const matrix = new Matrix(3, 4);
	
	t.is(matrix.get(1, 1), 0);

	matrix.set(1, 1, 2);

	t.is(matrix.get(1, 1), 2);

	t.throws(() => matrix.set(-1, 0, 0));
	t.throws(() => matrix.set(0, -1, 0));
	t.throws(() => matrix.set(3, 0, 0));
	t.throws(() => matrix.set(0, 4, 0));
});

test('Matrix.subtract', (t) => {
	const a = new Matrix(3, 4).map((n, r) => r + 4);
	const b = new Matrix(3, 4).map((n, r) => r + 3);
	
	a.subtract(b);

	t.is(a.get(1, 0), 1);
	t.is(a.get(2, 0), 1);
	t.throws(() => matrix.subtract(new Matrix(4, 3)));
});

test('Matrix.toArray', (t) => {
	const matrix = new Matrix(4, 1).map((n, r, c, i) => i + 1);

	t.deepEqual(Array.from(matrix.toArray()), [1, 2, 3, 4]);
});

test('Matrix.toString', (t) => {
	const matrix = new Matrix(3, 3).map((n, r, c, i) => i + r * c);

	t.is(matrix.toString(), '0 1 2 \n3 5 7 \n6 9 12 ');
});

test('Matrix.fromArray', (t) => {
	t.notThrows(() => Matrix.fromArray([1, 2]));
	t.notThrows(() => Matrix.fromArray(new Int8Array(2)));
	t.notThrows(() => Matrix.fromArray(new Uint8Array(2)));
	t.notThrows(() => Matrix.fromArray(new Uint8ClampedArray(2)));
	t.notThrows(() => Matrix.fromArray(new Int16Array(2)));
	t.notThrows(() => Matrix.fromArray(new Uint16Array(2)));
	t.notThrows(() => Matrix.fromArray(new Int32Array(2)));
	t.notThrows(() => Matrix.fromArray(new Uint32Array(2)));
	t.notThrows(() => Matrix.fromArray(new Float32Array(2)));
	t.notThrows(() => Matrix.fromArray(new Float64Array(2)));

	const matrix = Matrix.fromArray([1, 2, 3]);

	t.is(matrix.get(0, 0), 1);
	t.is(matrix.get(2, 0), 3);
});

test('Matrix.isSimilar', (t) => {
	t.throws(() => Matrix.isSimilar(new Matrix(1, 1), 1));
	t.throws(() => Matrix.isSimilar(1, new Matrix(1, 1)));

	t.true(Matrix.isSimilar(new Matrix(2, 3), new Matrix(2, 3)));
	t.false(Matrix.isSimilar(new Matrix(2, 3), new Matrix(3, 2)));
});

test('Matrix.multiply', (t) => {
	t.throws(() => Matrix.multiply(new Matrix(1, 1), 1));
	t.throws(() => Matrix.multiply(1, new Matrix(1, 1)));
	t.throws(() => Matrix.multiply(new Matrix(2, 3), new Matrix(3, 2)));

	const a = new Matrix(2, 3).map(n => 2);
	const b = new Matrix(2, 3).map(n => 3);
	const result = Matrix.multiply(a, b);

	t.is(result.rowCount, 2);
	t.is(result.columnCount, 3);
	t.is(result.get(0, 0), 2 * 3);
});

test('Matrix.product', (t) => {
	t.throws(() => Matrix.product(new Matrix(1, 1), 1));
	t.throws(() => Matrix.product(1, new Matrix(1, 1)));

	const a = new Matrix(3, 4).map(n => 2);
	const b = new Matrix(4, 3).map(n => 3);
	const result = Matrix.product(a, b);

	t.is(result.rowCount, 3);
	t.is(result.columnCount, 3);
	t.is(result.get(0, 0), 18);
});

test('Matrix.transpose', (t) => {
	t.throws(() => Matrix.transpose(1));

	const matrix = new Matrix(3, 2).map((n, r, c, i) => i + r * c);
	const matrixTransposed = Matrix.transpose(matrix);

	t.is(matrix.toString(), '0 1 \n2 4 \n4 7 ');
	t.is(matrixTransposed.rowCount, 2);
	t.is(matrixTransposed.columnCount, 3);
	t.is(matrixTransposed.toString(), '0 2 4 \n1 4 7 ');
});
