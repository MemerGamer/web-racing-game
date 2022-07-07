class Player {
  constructor(scene) {
    this.scene = scene;

    this.sprite = scene.sprites[PLAYER];

    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.w = (this.sprite.width / 1000) * 2;
    this.screen = { x: 0, y: 0, w: 0, h: 0 };
    this.maxSpeed = scene.circuit.segmentLength / (1 / 60);

    this.speed = 0;
  }
  init() {
    this.screen.w = this.sprite.width;
    this.screen.h = this.sprite.height;

    this.screen.x = SCREEN_CX;
    this.screen.y = SCREEN_H - this.screen.h / 2;
  }
  restart() {
    this.x = 0;
    this.y = 0;
    this.z = 0;

    this.speed = this.maxSpeed;
  }

  update(dt) {
    let circuit = this.scene.circuit;
    this.z += this.speed * dt;
    if (this.z >= circuit.roadLength) this.z -= circuit.roadLength;
  }
}
