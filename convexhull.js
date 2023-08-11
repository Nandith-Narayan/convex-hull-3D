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

    }

    addFace(p1, p2, p3) {
        let dir = getOrientation(p1, p2, p3);
        if (dir > 0) {
            this.faces.push({
                p1:p1,
                p2:p2,
                p3:p3
            });
        } else {
            this.faces.push({
                p1:p2,
                p2:p1,
                p3:p3
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
    getUniquePoints(){
        let points = [];
        for(let i=0;i<this.points.length;i++){
            points = points.concat(pointToArr(this.points[i]));
        }
        return points;
    }
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
    return pointList
}
