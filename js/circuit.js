class Circuit {
  constructor(scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics(0, 0);
    this.segments - [];
    this.segmentLength = 100;
    this.roadWidth = 1000;
  }

  create() {
    this.segments = [];
    this.createRoad();
  }

  createRoad() {
    this.createSection(10);
  }

  createSection(nSegments) {
    for (let i = 0; i < nSegments; i++) {
      this.createSegment();
      console.log("Created segment: ", this.segments[i]);
    }
  }

  createSegment() {
    let n = this.segments.length;

    this.segments.push({
      index: n,
      point: {
        world: { x: 0, y: 0, z: n * this.segmentLength },
        screen: { x: 0, y: 0, z: 0 },
        scale: -1,
      },
      color: { road: "0x888888" },
    });
  }

  project2D(point) {
    point.screen.x = SCREEN_CX;
    point.screen.y = SCREEN_H - point.world.z;
    point.screen.w = this.roadWidth;
  }

  render2D() {
    this.graphics.clear();
    let currSegment = this.segments[1];
    let prevSegment = this.segments[0];

    this.project2D(currSegment.point);
    this.project2D(prevSegment.point);

    let p1 = prevSegment.point.screen;
    let p2 = currSegment.point.screen;

    this.drawSegment(p1.x, p1.y, p1.w, p2.x, p2.y, p2.w, currSegment.color);

    //console.log("prev Segment Screen point:", p1);
    //console.log("curr Segment Screen point:", p2);
  }

  drawSegment(x1, y1, w1, x2, y2, w2, color) {
    this.drawPolygon(
      x1 - w1,
      y1,
      x1 + w1,
      y1,
      x2 + w2,
      y2,
      x2 - w2,
      y2,
      color.road
    );
  }
  drawPolygon(x1, y1, x2, y2, x3, y3, x4, y4, color) {
    this.graphics.fillStyle(color, 1);
    this.graphics.beginPath();

    this.graphics.moveTo(x1, y1);
    this.graphics.lineTo(x2, y2);
    this.graphics.lineTo(x3, y3);
    this.graphics.lineTo(x4, y4);

    this.graphics.closePath();
    this.graphics.fill();
  }
}
