import EventEmitter from '../utils/event-emitter.js';

export default class WorkerQueue extends EventEmitter {
	constructor(fileUrl) {
		super();

		this._isRunning = false;
		this._messageId = -1;
		this._messagesInProgress = new Set();
		this._queue = [];

		this._worker = new Worker(fileUrl);
		this._worker.addEventListener('message', (event) => {
			const { id, message } = event.data;

			this._isRunning = false;

			if (!this._messagesInProgress.has(id)) {
				return;
			}

			this._messagesInProgress.delete(id);

			this.trigger('message', message);
		});
	}

	clear() {
		this._isRunning = false;
		this._messagesInProgress.clear();
		this._queue = [];
	}

	createMessageId() {
		if (this._messageId === Number.MAX_SAFE_INTEGER) {
			this._messageId = -1;
		}

		return ++this._messageId;
	}

	run() {
		if (this._isRunning || this.isEmpty) {
			return;
		}

		this._isRunning = true;

		this._worker.postMessage(this._queue.shift());
	}

	queue(message) {
		const id = this.createMessageId();

		this._messagesInProgress.add(this._messageId);
		this._queue.push({
			id,
			message,
		});

		this.run();
	}

	get isEmpty() {
		return this._queue.length === 0;
	}

	get queueSize() {
		return this._queue.length;
	}
}
