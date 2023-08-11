export function test() {
    //console.log("yes");
}
export class ConvexHull {
    initPointList() {
        this.points = generatePoints();
        this.faces = [];
        this.addFace(this.points[0], this.points[1], this.points[2]);
        this.addFace(this.points[0], this.points[1], this.points[3]);
        this.addFace(this.points[0], this.points[2], this.points[3]);
        this.addFace(this.points[1], this.points[2], this.points[3]);
        
        for(let i=4;i<this.points.length;i++){
            this.iterateHull(this.points[i]);
        }
    }

    iterateHull(point) {
        let outsideFaces = []
        let insideFaces = []
        for (let i = 0; i < this.faces.length; i++) {
            let p1 = this.faces[i].p1;
            let p2 = this.faces[i].p2;
            let p3 = this.faces[i].p3;
            let dir = getOrientationToFace(p1, p2, p3, point);
            if (dir < 0) {
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
        const epsilon = 0.001;
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
                if (Math.abs(p1-p3)<epsilon && Math.abs(p2-p4)<epsilon) {
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
        
        
        /*this.faces = [];
        
        for(let i=0;i<insideFaces.length;i++){
            this.faces.push(insideFaces[i]);
        }*/
        
        for(let i=0;i<pairs.length;i++){
            this.addFace(pairs[i].p1, pairs[i].p2, point)
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
        let points = [];
        for (let i = 0; i < this.points.length; i++) {
            points = points.concat(pointToArr(this.points[i]));
        }
        return points;
    }
}

function getOrientationToFace(p1, p2, p3, p4) {
    let a = p1.x;
    let b = p1.y;
    let c = p1.z;
    let d = p2.x;
    let e = p2.y;
    let f = p2.z;
    let g = p3.x;
    let h = p3.y;
    let i = p3.z;
    let x = p4.x;
    let y = p4.y;
    let z = p4.z;

    let result = -1 * e * a * z;
    result -= a * f * h;
    result += a * f * y;
    result += a * h * z;
    result += b * d * z;
    result += b * f * g;
    result -= b * f * x;
    result -= b * g * z;
    result += c * d * h;
    result -= c * d * y;
    result -= e * c * g;
    result += e * c * x;
    result += c * g * y;
    result -= c * h * x;
    result -= d * h * z;
    result += e * g * z;
    result -= f * g * y;
    result += f * h * z;

    result += i * (e * a - a * y - b * d + b * x + d * y - e * x);

    return result;
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

function generatePoints() {
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
    for (let i = 0; i < 10; i++) {
        pointList.push({
            x: scale * (Math.random() * 2 - 1),
            y: scale * (Math.random() * 2 - 1),
            z: scale * (Math.random() * 2 - 1)
        });
    }

    return pointList
}
