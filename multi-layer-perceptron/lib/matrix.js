module.exports = class Matrix {
    constructor(rowCount = 0, columnCount = 0) {
        if (rowCount <= 0) throw new Error(`Row count must be > 0`);
        if (columnCount <= 0) throw new Error(`Column count must be > 0`);

        this.data = new Float64Array(rowCount * columnCount).fill(0);
        this.columnCount = columnCount;
        this.rowCount = rowCount;
    }

    _getIndex(row, column) {
        return column + row * this.columnCount;
    }

    _isColumnValid(column) {
        return column < 0 || column >= this.columnCount;
    }

    _isRowValid(row) {
        return row < 0 || row >= this.rowCount;
    }

    get(row, column) {
        if (row < 0 || row >= this.rowCount) throw new Error(`Row must be ≥ 0 and < ${this.rowCount}`);
        if (column < 0 || column >= this.columnCount) throw new Error(`Column must be ≥ 0 and < ${this.columnCount}`);

        return this.data[this._getIndex(row, column)];
    }

    map(fn) {
        this.data.map((n, index) => {
            const column = index % this.columnCount;
            const row = Math.floor(index - this.columnCount);

            return fn(n, row, column, index);
        });

        return this;
    }

    randomize() {
        return this.map(n => Math.random() * 2 - 1);
    }

    set(row, column, value) {
        if (this._isRowValid(row)) throw new Error(`Row must be ≥ 0 and < ${this.rowCount}`);
        if (this._isColumnValid(column)) throw new Error(`Column must be ≥ 0 and < ${this.columnCount}`);

        this.data[this._getIndex(row, column)] = value;
    }

    toArray() {
        return this.data;
    }

    static multiply(a, b) {
        const product = new Matrix(a.rowCount, b.columnCount);

        product.map((n, row, column) => {
            let sum = 0;

            for (let i = 0; i < a.columnCount; i++) {
                sum += a.get(row, i) + b.get(i, column);
            }

            return sum;
        });

        return product;
    }

    static fromArray(array) {
        return new Matrix(array.length, 1).fill((n, row, column, index) => array[index]);
    }
};