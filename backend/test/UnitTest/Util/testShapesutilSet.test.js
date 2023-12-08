import { getShapesBetweenStops } from '../../../src/utils/shapesUtilSet.js';
import { Shape, StopTime } from '../../../src/DBmodels/busline.js';

// Mock the StopTime model
jest.mock('../../../src/DBmodels/busline.js', () => ({
  StopTime: {
    findOne: jest.fn(),
  },
}));

describe('getShapesBetweenStops', () => {
  const shapes = [
    { shape_dist_traveled: 0 },
    { shape_dist_traveled: 10 },
    { shape_dist_traveled: 20 },
    { shape_dist_traveled: 30 },
  ];

  const previousStop = { _id: 'previousStopId', shape_dist_traveled: 5 };
  const currentStop = { _id: 'currentStopId', shape_dist_traveled: 25 };

  beforeEach(() => {
    // Reset mock calls before each test
    jest.clearAllMocks();
  });

  it('should filter shapes between the given stops', async () => {
    // Mock StopTime.findOne to return the corresponding stop distances
    StopTime.findOne.mockResolvedValueOnce({ shape_dist_traveled: 5 });
    StopTime.findOne.mockResolvedValueOnce({ shape_dist_traveled: 25 });

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
