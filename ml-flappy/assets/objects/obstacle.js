import Vector2 from '../math/vector2.js';
import GameObject from './game-object.js';
import Box from '../models/box.js';

export default class ObstacleObject extends GameObject {
	constructor(position, velocity = new Vector2(-1, 0)) {
		super(position, velocity);

		this.randomizeGap();
	}

	getBoundingBoxes(context) {
		const { height } = context.canvas;
		const aBottomY = height * this._gap - ObstacleObject.GAP_HEIGHT_HALF;
		const bTopY = height * this._gap + ObstacleObject.GAP_HEIGHT_HALF;

		return [
			new Box(
				new Vector2(this.position.x, 0),
				new Vector2(ObstacleObject.WIDTH, aBottomY)
			),
			new Box(
				new Vector2(this.position.x, bTopY),
				new Vector2(ObstacleObject.WIDTH, height - bTopY)
			),
		];
	}

	update() {
		super.update();
	}

	randomizeGap() {
		this._gap = 0.125 + 0.75 * Math.random();
	}

	render(context) {
		this.getBoundingBoxes(context)
			.forEach(box => context.fillRect(box.position.x, box.position.y, box.size.x, box.size.y));
	}

	static get WIDTH() {
		return 50;
	}

	static get GAP_HEIGHT_HALF() {
		return 25;
	}
}
