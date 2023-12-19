import { getShapesBetweenStops } from '../../../src/utils/shapesUtilSet.js';
import { Shape, StopTime } from '../../../src/DBmodels/busline.js';
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

describe('getShapesBetweenStops', () => {
  // Define the mock data outside of the beforeEach
  const shapes = [
    { shape_dist_traveled: 0 },
    { shape_dist_traveled: 10 },
    { shape_dist_traveled: 20 },
    { shape_dist_traveled: 30 },
  ];
  const previousStop = { _id: 'previousStopId', shape_dist_traveled: 5 };
  const currentStop = { _id: 'currentStopId', shape_dist_traveled: 25 };

  beforeEach(() => {
    // Mock the StopTime model within beforeEach
    jest.mock('../../../src/DBmodels/busline.js', () => ({
      StopTime: {
        findOne: jest.fn(),
      },
    }));

    // Reset mock calls before each test
    jest.clearAllMocks();

    // Setup mock implementations
    StopTime.findOne.mockResolvedValueOnce(previousStop);
    StopTime.findOne.mockResolvedValueOnce(currentStop);
  });

  it('should filter shapes between the given stops', async () => {
    const result = await getShapesBetweenStops(shapes, previousStop, currentStop);

    // Assertions
    expect(StopTime.findOne).toHaveBeenCalledWith({ _id: 'previousStopId' });
    expect(StopTime.findOne).toHaveBeenCalledWith({ _id: 'currentStopId' });
    expect(result).toEqual([
      { shape_dist_traveled: 10 },
      { shape_dist_traveled: 20 },
    ]);
  });
});
