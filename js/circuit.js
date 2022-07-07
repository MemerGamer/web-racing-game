class Circuit {
  constructor(scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics(0, 0);
    this.segments - [];
    this.segmentLength = 100;
    this.total_segments = null;
    this.visible_segments = 200;
    this.rumble_segments = 5;
    this.roadLanes = 3;
    this.roadWidth = 1000;
    this.roadLength = null;
  }

  create() {
    this.segments = [];
    this.createRoad();
    for (let n = 0; n < this.rumble_segments; n++) {
      this.segments[n].color.road = "0xFFFFFF"; //start
      this.segments[this.segments.length - 1 - n].color.road = "0x222222"; //finish
    }
    this.total_segments = this.segments.length;
    this.roadLength = this.total_segments * this.segmentLength;
  }

  createRoad() {
    this.createSection(1000);
  }

  createSection(nSegments) {
    for (let i = 0; i < nSegments; i++) {
      this.createSegment();
    }
  }

  createSegment() {
    const COLORS = {
      LIGHT: { road: "0x888888", grass: "0x429352", rumble: "0xb8312e" },
      DARK: {
        road: "0x666666",
        grass: "0x397d46",
        rumble: "0xDDDDDD",
        lane: "0xFFFFFF",
      },
    };

    let n = this.segments.length;

    this.segments.push({
      index: n,
      point: {
        world: { x: 0, y: 0, z: n * this.segmentLength },
        screen: { x: 0, y: 0, z: 0 },
        scale: -1,
      },
      color:
        Math.floor(n / this.rumble_segments) % 2 ? COLORS.DARK : COLORS.LIGHT,
    });
  }

  getSegment(positionZ) {
    if (positionZ < 0) {
      positionZ += this.roadLength;
      let index =
        Math.floor(positionZ / this.segmentLength) % this.total_segments;
      return this.segments[index];
    }
  }

  project3D(point, cameraX, cameraY, cameraZ, cameraDepth) {
    let transX = point.world.x - cameraX;
    let transY = point.world.y - cameraY;
    let transZ = point.world.z - cameraZ;

    point.scale = cameraDepth / transZ;

    let projectedX = point.scale * transX;
    let projectedY = point.scale * transY;
    let projectedW = point.scale * this.roadWidth;

    point.screen.x = Math.round((1 + projectedX) * SCREEN_CX);
    point.screen.y = Math.round((1 - projectedY) * SCREEN_CY);
    point.screen.w = Math.round(projectedW * SCREEN_CX);
  }

  render3D() {
    this.graphics.clear();

    let camera = this.scene.camera;

    let baseSegment = this.getSegment(camera.z);
    let baseIndex = baseSegment.index;

    for (let n = 0; n < this.visible_segments; n++) {
      let currIndex = (baseIndex + n) % this.total_segments;
      let currSegment = this.segments[currIndex];

      this.project3D(
        currSegment.point,
        camera.x,
        camera.y,
        camera.z,
        camera.distToPlane
      );
      if (n > 0) {
        let prevIndex = currIndex > 0 ? currIndex - 1 : this.total_segments - 1;
        let prevSegment = this.segments[prevIndex];

        let p1 = prevSegment.point.screen;
        let p2 = currSegment.point.screen;

        this.drawSegment(p1.x, p1.y, p1.w, p2.x, p2.y, p2.w, currSegment.color);
      }
    }
  }

  drawSegment(x1, y1, w1, x2, y2, w2, color) {
    // draw grass
    this.graphics.fillStyle(color.grass, 1);
    this.graphics.fillRect(0, y2, SCREEN_W, y1 - y2);

    // draw road
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

    //draw rumble strips
    let rumble_w1 = w1 / 5;
    let rumble_w2 = w2 / 5;
    this.drawPolygon(
      x1 - w1 - rumble_w1,
      y1,
      x1 - w1,
      y1,
      x2 - w2,
      y2,
      x2 - w2 - rumble_w2,
      y2,
      color.rumble
    );
    this.drawPolygon(
      x1 + w1 + rumble_w1,
      y1,
      x1 + w1,
      y1,
      x2 + w2,
      y2,
      x2 + w2 + rumble_w2,
      y2,
      color.rumble
    );

    //draw lanes
    if (color.lane) {
      let line_w1 = w1 / 20 / 2;
      let line_w2 = w2 / 20 / 2;

      let lane_w1 = (w1 * 2) / this.roadLanes;
      let lane_w2 = (w2 * 2) / this.roadLanes;

      let lane_x1 = x1 - w1;
      let lane_x2 = x2 - w2;

      for (let i = 1; i < this.roadLanes; i++) {
        lane_x1 += lane_w1;
        lane_x2 += lane_w2;
        this.drawPolygon(
          lane_x1 - line_w1,
          y1,
          lane_x1 + line_w1,
          y1,
          lane_x2 + line_w2,
          y2,
          lane_x2 - line_w2,
          y2,
          color.lane
        );
      }
    }
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
