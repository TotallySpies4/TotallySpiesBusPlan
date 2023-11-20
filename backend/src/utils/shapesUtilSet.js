import {Shape, StopTime} from "../DBmodels/busline.js";

export async function getShapesBetweenStops(shapes, previousStop, currentStop) {
    // Find all shapes with the given shape_id
    console.log("Finding the shapes between the stops")
    console.log("previousStop", previousStop)
    console.log("currentStop", currentStop)

    const previousStopQuery = await StopTime.findOne({_id: previousStop._id});
    const currentStopQuery = await StopTime.findOne({_id: currentStop._id});
    console.log("previousStopShape",previousStopQuery)
    console.log("currentStopShape",currentStopQuery)


    console.log("start finding the shapes between the stops")
    // Filter out shapes that are not between the start and end distances
    const filteredShapes = shapes.filter(shape =>
        shape.shape_dist_traveled >= previousStopQuery.shape_dist_traveled &&
        shape.shape_dist_traveled <= currentStopQuery.shape_dist_traveled
    );
    console.log("filteredShapes",filteredShapes)
    console.log("end finding the shapes between the stops")
    return filteredShapes;
}