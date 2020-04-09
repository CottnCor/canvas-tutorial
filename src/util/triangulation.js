/*eslint-disable*/

let boundaries;
let enclosingPoints = [];

function isInside(point, array) {
    let a = array[0];
    let b = array[1];
    let c = array[2];

    let vectorAB = { x: b.x - a.x, y: b.y - a.y };
    let vectorAC = { x: c.x - a.x, y: c.y - a.y };
    let vectorBC = { x: c.x - b.x, y: c.y - b.y };

    let vectorAX = { x: point.x - a.x, y: point.y - a.y };
    let vectorBX = { x: point.x - b.x, y: point.y - b.y };

    let det1 = vectorAB.x * vectorAX.y - vectorAB.y * vectorAX.x;
    let det2 = vectorAB.x * vectorAC.y - vectorAB.y * vectorAC.x;

    let det3 = vectorAC.x * vectorAX.y - vectorAC.y * vectorAX.x;
    let det4 = vectorAC.x * vectorAB.y - vectorAC.y * vectorAB.x;

    let det5 = vectorBC.x * vectorBX.y - vectorBC.y * vectorBX.x;
    let det6 = vectorBC.y * vectorAB.x - vectorBC.x * vectorAB.y;

    if (
        (det1 * det2 > 0 && det3 * det4 > 0 && det5 * det6 > 0) ||
        (det1 * det2 > 0 && det3 * det4 > 0 && det5 * det6 === 0) ||
        (det1 * det2 > 0 && det3 * det4 === 0 && det5 * det6 > 0) ||
        (det1 * det2 === 0 && det3 * det4 > 0 && det5 * det6 > 0) ||
        (det1 * det2 > 0 && det3 * det4 === 0 && det5 * det6 === 0) ||
        (det1 * det2 === 0 && det3 * det4 === 0 && det5 * det6 > 0) ||
        (det1 * det2 === 0 && det3 * det4 > 0 && det5 * det6 === 0)
    ) {
        return 1;
    }
    return 0;
}

function isLine(points) {
    if (
        (points[1].x - points[0].x) * (points[2].y - points[0].y) -
            (points[2].x - points[0].x) * (points[1].y - points[0].y) ===
        0
    )
        return 1;
    return 0;
}

function isEqual(a, b) {
    if (a && b && a.x === b.x && a.y === b.y) return 1;
    return 0;
}

function isLeft(a, b, c) {
    if (a && b && c) {
        let vector1 = { x: b.x - a.x, y: b.y - a.y };
        let vector2 = { x: c.x - a.x, y: c.y - a.y };
        let det = vector1.x * vector2.y - vector1.y * vector2.x;
        if (det < 0) return 0;
        return 1;
    } else return 1;
}

function isExterior(triangle, points) {
    let vertices = getPoints(triangle);
    if (boundaries !== undefined) {
        for (let i = 0; i < boundaries.length; i++) {
            for (let j = 0; j < boundaries[i].length; j++) {
                let boundaryPoint = points[boundaries[i][j]];
                if (
                    isEqual(boundaryPoint, vertices[0]) === 1 ||
                    isEqual(boundaryPoint, vertices[1]) === 1 ||
                    isEqual(boundaryPoint, vertices[2]) === 1
                ) {
                    if (boundaries[i].length < 3) return 1;

                    let point1;
                    let point2;

                    if (isEqual(boundaryPoint, vertices[0]) === 1) {
                        point1 = vertices[1];
                        point2 = vertices[2];
                    } else if (isEqual(boundaryPoint, vertices[1]) === 1) {
                        point1 = vertices[0];
                        point2 = vertices[2];
                    } else {
                        point1 = vertices[0];
                        point2 = vertices[1];
                    }

                    let previousPoint;
                    let nextPoint;

                    if (j === 0) previousPoint = points[boundaries[i][boundaries[i].length - 1]];
                    else previousPoint = points[boundaries[i][j - 1]];

                    if (j === boundaries[i].length - 1) nextPoint = points[boundaries[i][0]];
                    else nextPoint = points[boundaries[i][j + 1]];

                    if (isLeft(previousPoint, boundaryPoint, nextPoint)) {
                        if (
                            isLeft(previousPoint, boundaryPoint, point1) &&
                            isLeft(previousPoint, boundaryPoint, point2) &&
                            isLeft(boundaryPoint, nextPoint, point1) &&
                            isLeft(boundaryPoint, nextPoint, point2)
                        )
                            return 0;
                        else return 1;
                    } else {
                        if (
                            (isLeft(previousPoint, boundaryPoint, point1) ||
                                isLeft(boundaryPoint, nextPoint, point1)) &&
                            (isLeft(previousPoint, boundaryPoint, point2) ||
                                isLeft(boundaryPoint, nextPoint, point2))
                        )
                            return 0;
                        else return 1;
                    }
                }
            }
        }
    }
    return 0;
}

function isEnclosing(points) {
    for (let i = 0; i < enclosingPoints.length; i++) {
        if (
            isEqual(points[0], enclosingPoints[i]) ||
            isEqual(points[1], enclosingPoints[i]) ||
            isEqual(points[2], enclosingPoints[i])
        )
            return 1;
    }
    return 0;
}

function sortCounterclockwise(circle_points) {
    let vector12 = {
        x: circle_points[1].x - circle_points[0].x,
        y: circle_points[1].y - circle_points[0].y
    };
    let vector13 = {
        x: circle_points[2].x - circle_points[0].x,
        y: circle_points[2].y - circle_points[0].y
    };

    let det = vector12.x * vector13.y - vector12.y * vector13.x;

    if (det < 0) {
        let point = circle_points[0];
        circle_points[0] = circle_points[2];
        circle_points[2] = point;
    }

    return circle_points;
}

function isInsideTheCircle(point, points) {
    let _points = sortCounterclockwise(points);

    let a1 = _points[0].x;
    let a2 = _points[0].y;
    let b1 = _points[1].x;
    let b2 = _points[1].y;
    let c1 = _points[2].x;
    let c2 = _points[2].y;
    let x = point.x;
    let y = point.y;

    let matrix = math.matrix([
        [a1 - x, b1 - x, c1 - x],
        [a2 - y, b2 - y, c2 - y],
        [
            (a1 - x) * (a1 - x) + (a2 - y) * (a2 - y),
            (b1 - x) * (b1 - x) + (b2 - y) * (b2 - y),
            (c1 - x) * (c1 - x) + (c2 - y) * (c2 - y)
        ]
    ]);

    let det = math.det(matrix);

    if (det < 0) return 0;
    else return 1;
}

function getPoints(face) {
    let a = face.edge.previous.origin;
    let b = face.edge.origin;
    let c = face.edge.next.origin;
    return [a, b, c];
}

function isAdjacent(p, a, b, vertices) {
    if (
        (isEqual(a, vertices[0]) === 1 ||
            isEqual(a, vertices[1]) === 1 ||
            isEqual(a, vertices[2]) === 1) &&
        (isEqual(b, vertices[0]) === 1 ||
            isEqual(b, vertices[1]) === 1 ||
            isEqual(b, vertices[2]) === 1) &&
        isEqual(p, vertices[0]) === 0 &&
        isEqual(p, vertices[1]) === 0 &&
        isEqual(p, vertices[2]) === 0 &&
        isLine(vertices) === 0
    )
        return 1;
    return 0;
}

function findTriangle(face, point) {
    let list = [];
    if (isInside(point, getPoints(face)) === 0) return list;
    if (face.children.length < 1) {
        return [face];
    }
    for (let i = 0; i < face.children.length; i++) {
        if (face.children[i] !== undefined) {
            let child = face.children[i];
            let triangle = findTriangle(child, point);
            for (let j = 0; j < triangle.length; j++) {
                list[list.length] = triangle[j];
            }
        }
    }
    return list;
}

function computeTriangulation(points, bound) {
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = 0;
    let maxY = 0;

    for (let i = 0; i < points.length; i++) {
        if (points[i].x < minX) minX = points[i].x;
        if (points[i].x > maxX) maxX = points[i].x;
        if (points[i].y < minY) minY = points[i].y;
        if (points[i].y > maxY) maxY = points[i].y;
    }

    let p1 = { x: minX, y: minY, z: 0 };
    let p2 = { x: maxX + (maxY - minY), y: minY, z: 0 };
    let p3 = { x: minX, y: maxY + (maxX - minX), z: 0 };

    let isInPoints1 = 0;
    let isInPoints2 = 0;
    let isInPoints3 = 0;

    for (let i = 0; i < points.length; i++) {
        if (isEqual(points[i], p1)) isInPoints1 = 1;
        if (isEqual(points[i], p2)) isInPoints2 = 1;
        if (isEqual(points[i], p3)) isInPoints3 = 1;
    }

    if (isInPoints1 === 0) enclosingPoints[enclosingPoints.length] = p1;
    if (isInPoints2 === 0) enclosingPoints[enclosingPoints.length] = p2;
    if (isInPoints3 === 0) enclosingPoints[enclosingPoints.length] = p3;

    points[points.length] = p1;
    points[points.length] = p2;
    points[points.length] = p3;

    boundaries = bound;

    let vertices = [];
    let edges = [];
    let faces = [];
    let j = 0;

    for (let i = points.length - 3; i < points.length; i++) {
        vertices[j] = { x: points[i].x, y: points[i].y, z: points[i].z };
        edges[j] = { origin: vertices[j] };
        faces[0] = { edge: edges[0], children: [], parent: [] };
        vertices[j].edge = edges[j];
        edges[j].face = faces[j];
        j += 1;
    }
    edges[0].next = edges[1];
    edges[0].previous = edges[2];
    edges[1].next = edges[2];
    edges[1].previous = edges[0];
    edges[2].next = edges[0];
    edges[2].previous = edges[1];

    for (let i = 0; i < points.length - 3; i++) {
        let triangle = findTriangle(faces[0], points[i]);
        if (triangle.length === 1 || triangle.length === 2) {
            let trianglesQueue = [];
            vertices[vertices.length] = { x: points[i].x, y: points[i].y, z: points[i].z };
            let v = vertices[vertices.length - 1];
            let k = edges.length;

            for (let m = 0; m < triangle.length; m++) {
                let v1 = triangle[m].edge.origin;
                let v2 = triangle[m].edge.next.origin;
                let v3 = triangle[m].edge.previous.origin;

                edges[k] = { origin: v1 };
                edges[k + 1] = { origin: v2 };
                edges[k + 2] = { origin: v };

                k += 3;

                edges[k] = { origin: v2 };
                edges[k + 1] = { origin: v3 };
                edges[k + 2] = { origin: v };

                k += 3;

                edges[k] = { origin: v3 };
                edges[k + 1] = { origin: v1 };
                edges[k + 2] = { origin: v };

                for (let j = k - 6; j <= k; j = j + 3) {
                    v1.edge = edges[j];
                    v2.edge = edges[j + 1];
                    v.edge = edges[j + 2];

                    edges[j].next = edges[j + 1];
                    edges[j].previous = edges[j + 2];
                    edges[j + 1].next = edges[j + 2];
                    edges[j + 1].previous = edges[j];
                    edges[j + 2].next = edges[j];
                    edges[j + 2].previous = edges[j + 1];

                    faces[faces.length] = { edge: edges[j], children: [], parent: [triangle[m]] };

                    edges[j].face = faces[faces.length - 1];
                    edges[j + 1].face = faces[faces.length - 1];
                    edges[j + 2].face = faces[faces.length - 1];

                    trianglesQueue.push(faces.length - 1);

                    triangle[m].children[triangle[m].children.length] = faces[faces.length - 1];
                }
            }
            while (trianglesQueue.length !== 0) {
                let point1;
                let point2;
                let point3;
                let p = points[i];

                let index = trianglesQueue.pop();
                let currentTrianglePoints = getPoints(faces[index]);

                if (isEqual(currentTrianglePoints[0], p) === 1) {
                    point1 = currentTrianglePoints[1];
                    point2 = currentTrianglePoints[2];
                } else if (isEqual(currentTrianglePoints[1], p) === 1) {
                    point1 = currentTrianglePoints[0];
                    point2 = currentTrianglePoints[2];
                } else {
                    point1 = currentTrianglePoints[0];
                    point2 = currentTrianglePoints[1];
                }

                if (isLine(currentTrianglePoints) === 0) {
                    for (let f = faces.length - 1; f > -1; f--) {
                        if (faces[f] !== undefined) {
                            let currentFacePoints = getPoints(faces[f]);
                            if (
                                isAdjacent(p, point1, point2, currentFacePoints) &&
                                faces[f].children.length === 0
                            ) {
                                if (
                                    (isEqual(point1, currentFacePoints[0]) &&
                                        isEqual(point2, currentFacePoints[1])) ||
                                    (isEqual(point2, currentFacePoints[0]) &&
                                        isEqual(point1, currentFacePoints[1]))
                                )
                                    point3 = currentFacePoints[2];
                                else if (
                                    (isEqual(point1, currentFacePoints[2]) &&
                                        isEqual(point2, currentFacePoints[1])) ||
                                    (isEqual(point2, currentFacePoints[2]) &&
                                        isEqual(point1, currentFacePoints[1]))
                                )
                                    point3 = currentFacePoints[0];
                                else point3 = currentFacePoints[1];

                                if (isInsideTheCircle(p, currentFacePoints)) {
                                    let parents = [faces[f], faces[index]];

                                    let k = edges.length;

                                    edges[k] = { origin: p };
                                    edges[k + 1] = { origin: point1 };
                                    edges[k + 2] = { origin: point3 };

                                    edges[k].next = edges[k + 1];
                                    edges[k].previous = edges[k + 2];
                                    edges[k + 1].next = edges[k + 2];
                                    edges[k + 1].previous = edges[k];
                                    edges[k + 2].next = edges[k];
                                    edges[k + 2].previous = edges[k + 1];

                                    faces[faces.length] = {
                                        edge: edges[k],
                                        children: [],
                                        parent: parents
                                    };

                                    edges[k].face = faces[faces.length - 1];
                                    edges[k + 1].face = faces[faces.length - 1];
                                    edges[k + 2].face = faces[faces.length - 1];

                                    k += 3;

                                    edges[k] = { origin: p };
                                    edges[k + 1] = { origin: point2 };
                                    edges[k + 2] = { origin: point3 };

                                    edges[k].next = edges[k + 1];
                                    edges[k].previous = edges[k + 2];
                                    edges[k + 1].next = edges[k + 2];
                                    edges[k + 1].previous = edges[k];
                                    edges[k + 2].next = edges[k];
                                    edges[k + 2].previous = edges[k + 1];

                                    faces[faces.length] = {
                                        edge: edges[k],
                                        children: [],
                                        parent: parents
                                    };

                                    edges[k].face = faces[faces.length - 1];
                                    edges[k + 1].face = faces[faces.length - 1];
                                    edges[k + 2].face = faces[faces.length - 1];

                                    faces[f].children[faces[f].children.length] =
                                        faces[faces.length - 1];
                                    faces[f].children[faces[f].children.length] =
                                        faces[faces.length - 2];
                                    faces[index].children[faces[index].children.length] =
                                        faces[faces.length - 1];
                                    faces[index].children[faces[index].children.length] =
                                        faces[faces.length - 2];

                                    trianglesQueue.push(faces.length - 1);
                                    trianglesQueue.push(faces.length - 2);
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    let outputTriangles = [];

    j = 0;
    for (let i = 0; i < faces.length; i++) {
        if (faces[i] !== undefined) {
            let threePoints = getPoints(faces[i]);
            if (
                faces[i].children.length === 0 &&
                isLine(threePoints) === 0 &&
                isExterior(faces[i], points) === 0 &&
                isEnclosing(threePoints) === 0
            ) {
                outputTriangles[j] = threePoints;
                j++;
            }
        }
    }

    return outputTriangles;
}

export { computeTriangulation };
