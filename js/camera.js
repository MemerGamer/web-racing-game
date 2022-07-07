class Camera {
  constructor(scene) {
    this.scene = scene;

    this.x = 0;
    this.y = 1000;
    this.z = 0;

    this.distToPlayer = 500;

    this.distToPlane = null;
  }
  init() {
    this.distToPlane = 1 / (this.y / this.distToPlayer);
  }
  update() {
    this.z = -this.distToPlayer;
  }
}
