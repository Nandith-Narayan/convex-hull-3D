export function test() {
    //console.log("yes");
}
export class ConvexHull {
    initPointList(numPoints) {
        this.points = generatePoints(numPoints);
        this.initHull();

        for (let i = 4; i < this.points.length; i++) {
            this.iterateHull(i);
        }
    }

    initHull() {
        this.pointIsOnHull = [];
        for (let i = 0; i < this.points.length; i++) {
            this.pointIsOnHull.push(i < 4);
        }
        this.faces = [];
        this.addFace(this.points[0], this.points[1], this.points[2]);
        this.addFace(this.points[0], this.points[1], this.points[3]);
        this.addFace(this.points[0], this.points[2], this.points[3]);
        this.addFace(this.points[1], this.points[2], this.points[3]);
    }

    iterateHull(index) {
        const point = this.points[index];
        let outsideFaces = []
        let insideFaces = []
        for (let i = 0; i < this.faces.length; i++) {
            let p1 = this.faces[i].p1;
            let p2 = this.faces[i].p2;
            let p3 = this.faces[i].p3;
            let dir = getOrientationToFace(p1, p2, p3, point);
            if (dir > 0) {
                outsideFaces.push(this.faces[i]);
            } else {
                insideFaces.push(this.faces[i]);
            }
        }

        if (outsideFaces.length == 0) {
            return;
        }

        let pairs = []

        for (let i = 0; i < outsideFaces.length; i++) {
            let p1 = outsideFaces[i].p1;
            let p2 = outsideFaces[i].p2;
            let p3 = outsideFaces[i].p3;
            pairs.push({
                p1: p1,
                p2: p2
            });
            pairs.push({
                p1: p2,
                p2: p3
            });
            pairs.push({
                p1: p3,
                p2: p1
            });
        }

        let validPairs = []

        for (let i = 0; i < pairs.length; i++) {
            let p1 = pairs[i].p1;
            let p2 = pairs[i].p2;

            let isValid = true;
            for (let j = 0; j < pairs.length; j++) {
                if (j == i) {
                    continue;
                }
                let p3 = pairs[j].p1;
                let p4 = pairs[j].p2;
                if ((arePointsEqual(p1, p3) && arePointsEqual(p2, p4)) || (arePointsEqual(p1, p4) && arePointsEqual(p2, p3))) {
                    isValid = false;
                    break;
                }
            }
            if (isValid) {
                validPairs.push({
                    p1,
                    p2
                });
            }
        }

        this.faces = [];

        for (let i = 0; i < insideFaces.length; i++) {
            this.faces.push(insideFaces[i]);
        }

        for (let i = 0; i < validPairs.length; i++) {
            this.addFace(validPairs[i].p1, validPairs[i].p2, point)
        }

    }

    addFace(p1, p2, p3) {
        let dir = getOrientation(p1, p2, p3);
        if (dir > 0) {
            this.faces.push({
                p1: p1,
                p2: p2,
                p3: p3
            });
        } else {
            this.faces.push({
                p1: p2,
                p2: p1,
                p3: p3
            });
        }
    }

    calcInsidePoints() {

        for (let index = 0; index < this.points.length; index++) {
            let onHull = false;
            for (let i = 0; i < this.faces.length; i++) {
                if (arePointsEqual(this.faces[i].p1, this.points[index]) || arePointsEqual(this.faces[i].p2, this.points[index]) || arePointsEqual(this.faces[i].p3, this.points[index])) {
                    onHull = true;
                    break;
                }
            }
            this.pointIsOnHull[index] = onHull;
        }

    }

    getPointsFromFaces() {
        let points = [];
        for (let i = 0; i < this.faces.length; i++) {
            points = points.concat(pointToArr(this.faces[i].p1));
            points = points.concat(pointToArr(this.faces[i].p2));
            points = points.concat(pointToArr(this.faces[i].p3));
        }
        return points;
    }
    getUniquePoints() {
        this.calcInsidePoints();
        let points = [];
        for (let i = 0; i < this.points.length; i++) {
            if (!this.pointIsOnHull[i]) {
                points = points.concat(pointToArr(this.points[i]));
            }
        }
        return points;
    }

    getUniqueHullPoints() {
        let points = [];
        for (let i = 0; i < this.points.length; i++) {
            if (this.pointIsOnHull[i]) {
                points = points.concat(pointToArr(this.points[i]));
            }
        }
        return points;
    }

    computeNormals() {
        let normals = [];

        for (let i = 0; i < this.faces.length; i++) {
            const p1 = this.faces[i].p1;
            const p2 = this.faces[i].p2;
            const p3 = this.faces[i].p3;

            const Ax = p2.x - p1.x;
            const Ay = p2.y - p1.y;
            const Az = p2.z - p1.z;

            const Bx = p3.x - p1.x;
            const By = p3.y - p1.y;
            const Bz = p3.z - p1.z;

            let Nx = Ay * Bz - Az * By;
            let Ny = Az * Bx - Ax * Bz;
            let Nz = Ax * By - Ay * Bx;

            const length = Math.sqrt(Nx * Nx + Ny * Ny + Nz * Nz);

            Nx /= length;
            Ny /= length;
            Nz /= length;

            const scale = 0.5;

            normals.push({
                x1: (p1.x + p2.x + p3.x) / 3,
                y1: (p1.y + p2.y + p3.y) / 3,
                z1: (p1.z + p2.z + p3.z) / 3,
                x2: (p1.x + p2.x + p3.x) / 3 + Nx * scale,
                y2: (p1.y + p2.y + p3.y) / 3 + Ny * scale,
                z2: (p1.z + p2.z + p3.z) / 3 + Nz * scale
            });
        }

        return normals;
    }

}

function getOrientationToFace(p1, p2, p3, p4) {
    const Ax = p2.x - p1.x;
    const Ay = p2.y - p1.y;
    const Az = p2.z - p1.z;

    const Bx = p3.x - p1.x;
    const By = p3.y - p1.y;
    const Bz = p3.z - p1.z;

    let Nx = Ay * Bz - Az * By;
    let Ny = Az * Bx - Ax * Bz;
    let Nz = Ax * By - Ay * Bx;

    const length = Math.sqrt(Nx * Nx + Ny * Ny + Nz * Nz);

    Nx /= length;
    Ny /= length;
    Nz /= length;

    let Px = (p1.x + p2.x + p3.x) / 3;
    let Py = (p1.y + p2.y + p3.y) / 3;
    let Pz = (p1.z + p2.z + p3.z) / 3;

    return Nx * (p4.x - Px) + Ny * (p4.y - Py) + Nz * (p4.z - Pz);
}

function getOrientation(p1, p2, p3) {
    let a = p1.x;
    let b = p1.y;
    let c = p1.z;
    let d = p2.x;
    let e = p2.y;
    let f = p2.z;
    let g = p3.x;
    let h = p3.y;
    let i = p3.z;

    return a * (e * i - f * h) + c * (d * h - e * g) - b * (d * i - f * g);
}

function pointToArr(p) {
    return [p.x, p.y, p.z];
}

function arePointsEqual(p1, p2) {
    const epsilon = 0.001;

    return (Math.abs(p1.x - p2.x) < epsilon) && (Math.abs(p1.y - p2.y) < epsilon) && (Math.abs(p1.z - p2.z) < epsilon);
}

function generatePoints(numPoints) {
    let pointList = [];

    pointList.push({
        x: 1.0,
        y: 1.0,
        z: 1.0
    });
    pointList.push({
        x: 1.0,
        y: -1.0,
        z: -1.0
    });
    pointList.push({
        x: -1.0,
        y: 1.0,
        z: -1.0
    });
    pointList.push({
        x: -1.0,
        y: -1.0,
        z: 1.0
    });

    let scale = 2.0;
    for (let i = 0; i < numPoints - 4; i++) {
        pointList.push({
            x: scale * (Math.random() * 2 - 1),
            y: scale * (Math.random() * 2 - 1),
            z: scale * (Math.random() * 2 - 1)
        });
    }

    return pointList
}
