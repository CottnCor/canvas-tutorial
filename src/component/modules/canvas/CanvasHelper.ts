interface Point {
    x: number;
    y: number;
    z: number;
}

interface Camera {
    x: number;
    y: number;
    z: number;
}

const camera: Camera = {
    x: 0,
    y: 0,
    z: 300
};

/**
 *
 * @param point
 * @param offsetX
 * @param offsetY
 */
export const transformCoordinatePoint = function(point: Point, offsetX: number, offsetY: number) {
    return {
        x: ((point.x - camera.x) * camera.z) / (camera.z - point.z) + offsetX,
        y: ((point.y - camera.y) * camera.z) / (camera.z - point.z) + offsetY
    };
};
