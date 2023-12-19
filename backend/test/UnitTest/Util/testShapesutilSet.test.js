import { describe, it, expect, jest } from '@jest/globals';
import {StopTime} from "../../../src/DBmodels/busline.js";
import {getShapesBetweenStops} from "../../../src/utils/shapesUtilSet.js";

jest.mock("../../../src/DBmodels/busline.js", () => ({ // Replace with the actual path to your DBmodels
  StopTime: {
    findOne: jest.fn()
  }
}));

describe('getShapesBetweenStops', () => {
  it('should filter shapes between two stops', async () => {
    // Mock data
    const shapes = [
      { shape_dist_traveled: 0 },
      { shape_dist_traveled: 10 },
      { shape_dist_traveled: 20 },
      { shape_dist_traveled: 30 },
    ];

    const previousStop = { _id: 'prevStopId', stop_id: 'prevStop', shape_dist_traveled: 5 };
    const currentStop = { _id: 'currStopId', stop_id: 'currStop', shape_dist_traveled: 25 };

    // Mock implementations
    StopTime.findOne
        .mockResolvedValueOnce(previousStop) // First call for previousStop
        .mockResolvedValueOnce(currentStop); // Second call for currentStop

    // Execute the function
    const result = await getShapesBetweenStops(shapes, previousStop, currentStop);

    // Assertions
    expect(result).toEqual([
      { shape_dist_traveled: 10 },
      { shape_dist_traveled: 20 }
    ]);
    expect(StopTime.findOne).toHaveBeenCalledTimes(2);
    expect(StopTime.findOne).toHaveBeenCalledWith({ _id: 'prevStopId' });
    expect(StopTime.findOne).toHaveBeenCalledWith({ _id: 'currStopId' });
  });
  it('should use stop_id as fallback when _id query returns null', async () => {
    // Mock data
    const shapes = [
      { shape_dist_traveled: 0 },
      { shape_dist_traveled: 10 },
      { shape_dist_traveled: 20 },
      { shape_dist_traveled: 30 },
    ];

    const previousStop = { _id: 'prevStopId', stop_id: 'prevStop', shape_dist_traveled: 5 };
    const currentStop = { _id: 'currStopId', stop_id: 'currStop', shape_dist_traveled: 25 };

    // Mock implementations
    StopTime.findOne
        .mockResolvedValueOnce(null) // First call for previousStop with _id returns null
        .mockResolvedValueOnce(null) // Second call for currentStop with _id returns null
        .mockResolvedValueOnce(previousStop) // Third call for previousStop with stop_id
        .mockResolvedValueOnce(currentStop); // Fourth call for currentStop with stop_id

    // Execute the function
    const result = await getShapesBetweenStops(shapes, previousStop, currentStop);

    // Assertions
    expect(result).toEqual([
      { shape_dist_traveled: 10 },
      { shape_dist_traveled: 20 }
    ]);
    expect(StopTime.findOne).toHaveBeenCalledTimes(6);
    expect(StopTime.findOne).toHaveBeenCalledWith({ _id: 'prevStopId' });
    expect(StopTime.findOne).toHaveBeenCalledWith({ _id: 'currStopId' });
    expect(StopTime.findOne).toHaveBeenCalledWith({ stop_id: 'prevStop' });
    expect(StopTime.findOne).toHaveBeenCalledWith({ stop_id: 'currStop' });
  });
});
