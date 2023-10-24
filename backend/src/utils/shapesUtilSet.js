import {Shape} from "../DBmodels/busline.js";

export async function getShapesBetweenStops(shapeId, startDist, endDist) {
    // Find all shapes with the given shape_id
    console.log("Finding the shapes between the stops")
    console.log("shapeId",shapeId)
    console.log("startDist",startDist)
    console.log("endDist",endDist)

    const shapes = await Shape.find({ shape_id: shapeId });
    console.log("shapes",shapes)
    // Filter out shapes that are not between the start and end distances
    const filteredShapes = shapes.filter(shape =>
        shape.shape_dist_traveled >= startDist &&
        shape.shape_dist_traveled <= endDist
    );
    console.log("filteredShapes",filteredShapes)

    return filteredShapes;
}