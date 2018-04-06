module.exports = class Matrix {
	constructor(rowCount = 0, columnCount = 0) {
		if (rowCount <= 0) throw new Error(`Row count must be > 0`);
		if (columnCount <= 0) throw new Error(`Column count must be > 0`);

		this.data = new Float64Array(rowCount * columnCount).fill(0);
		this.columnCount = columnCount;
		this.rowCount = rowCount;
	}

	_getColumnByIndex(index) {
		return index % this.columnCount;
	}

	_getIndex(row, column) {
		return column + row * this.columnCount;
	}

	_getRowByIndex(index) {
		return Math.floor(index / this.columnCount);
	}

	_isColumnValid(column) {
		return column >= 0 && column < this.columnCount;
	}

	_isRowValid(row) {
		return row >= 0 && row < this.rowCount;
	}

	add(matrix) {
		if (!Matrix.isSimilar(this, matrix)) {
			throw new Error(`${this} and ${matrix} should have equal row and column count`);
		}

		this.data = this.data.map((n, index) => n + matrix.data[index]);
		return this;
	}

	clone() {
		const clone = new Matrix(this.rowCount, this.columnCount);
		clone.data = new Float64Array(this.data);
		return clone;
	}

	get(row, column) {
		if (!this._isRowValid(row)) throw new Error(`Row must be ≥ 0 and < ${this.rowCount}`);
		if (!this._isColumnValid(column)) throw new Error(`Column must be ≥ 0 and < ${this.columnCount}`);

		const index = this._getIndex(row, column);

		return this.data[this._getIndex(row, column)];
	}

	forEach(fn) {
		if (typeof fn !== 'function') throw new Error(`${fn} must be a function`);

		this.data.forEach((n, index) => fn(n, this._getRowByIndex(index), this._getColumnByIndex(index), index));
		return this;
	}

	map(fn) {
		if (typeof fn !== 'function') throw new Error(`${fn} must be a function`);
		
		this.data = this.data.map((n, index) => fn(n, this._getRowByIndex(index), this._getColumnByIndex(index), index));
		return this;
	}

	multiply(matrix) {
		if (!Matrix.isSimilar(this, matrix)) {
			throw new Error(`${this} and ${matrix} should have equal row and column count`);
		}

		this.data = this.data.map((n, index) => n * matrix.data[index]);
		return this;
	}

	multiplyScalar(s) {
		if (typeof s !== 'number' || Number.isNaN(s)) throw new Error(`${s} must be a number`);

		this.data = this.data.map(n => n * s);
		return this;
	}

	randomize() {
		return this.map(n => Math.random() * 2 - 1);
	}

	set(row, column, value) {
		if (!this._isRowValid(row)) throw new Error(`Row must be ≥ 0 and < ${this.rowCount}`);
		if (!this._isColumnValid(column)) throw new Error(`Column must be ≥ 0 and < ${this.columnCount}`);

		this.data[this._getIndex(row, column)] = value;
	}

	subtract(matrix) {
		if (!Matrix.isSimilar(this, matrix)) {
			throw new Error(`${this} and ${matrix} should have equal row and column count`);
		}

		this.data = this.data.map((n, index) => n - matrix.data[index]);
		return this;
	}

	toArray() {
		return this.data;
	}

	toString() {
		const lines = new Array(this.rowCount).fill('');

		this.forEach((n, row, column) => {
			lines[row] += `${n.toString()} `;
		});

		return lines.join('\n');
	}

	static fromArray(array) {
		if (!(
			Array.isArray(array) ||
			array instanceof Int8Array ||
			array instanceof Uint8Array ||
			array instanceof Uint8ClampedArray ||
			array instanceof Int16Array ||
			array instanceof Uint16Array ||
			array instanceof Int32Array ||
			array instanceof Uint32Array ||
			array instanceof Float32Array ||
			array instanceof Float64Array)
		) throw new Error(`${array} is not an array`);

		return new Matrix(array.length, 1).map((n, row, column, index) => array[index]);
	}

	static isSimilar(a, b) {
		if (!(a instanceof Matrix && b instanceof Matrix)) {
			throw new Error(`${a} and ${b} must be of Matrix type`);
		}

		return a.rowCount === b.rowCount && a.columnCount === b.columnCount;
	}

	static multiply(a, b) {
		if (!Matrix.isSimilar(a, b)) {
			throw new Error(`${a} and ${b} should have equal row and column count`);
		}

		const result = new Matrix(a.rowCount, b.columnCount);

		result.map((n, row, column) => a.get(row, column) * b.get(row, column));

		return result;
	}

	static product(a, b) {
		if (!(a instanceof Matrix && b instanceof Matrix)) {
			throw new Error(`${a} and ${b} must be of Matrix type`);
		}

		if (b.rowCount !== a.columnCount) {
			throw new Error(`The amount of columns of ${a} should equal the amount of rows of ${b}`);
		}

		const product = new Matrix(a.rowCount, b.columnCount);

		product.map((n, row, column) => {
			let sum = 0;

			for (let i = 0; i < b.rowCount; i++) {
				sum += a.get(row, i) * b.get(i, column);
			}

			return sum;
		});

		return product;
	}

	static transpose(matrix) {
		if (!(matrix instanceof Matrix)) {
			throw new Error(`${matrix} must be of Matrix type`);
		}

		return new Matrix(matrix.columnCount, matrix.rowCount)
			.map((n, row, column) => {
				const f = matrix.get(column, row);
				return f;
			});
	}
};
