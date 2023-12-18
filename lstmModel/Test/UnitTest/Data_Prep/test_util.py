import unittest

from src.util import calculate_level


class MyTestCase(unittest.TestCase):

    def test_green_level(self):
        self.assertEqual(calculate_level(30, 20), 0)  # Green: 30 > 20 + 5
        self.assertEqual(calculate_level(26, 20), 0)  # Green: 26 > 20 + 5

    def test_yellow_level(self):
        self.assertEqual(calculate_level(24, 20), 1)  # Yellow: 24 <= 20 + 5 and 24 > 20 - 5
        self.assertEqual(calculate_level(25, 20), 1)  # Yellow: 25 <= 20 + 5 and 25 > 20 - 5

    def test_red_level(self):
        self.assertEqual(calculate_level(15, 20), 2)  # Red: 15 <= 20 - 5
        self.assertEqual(calculate_level(14, 20), 2)  # Red: 14 <= 20 - 5

    def test_boundary_conditions(self):
        # Boundary condition for yellow (20 - 5 < schedule_speed <= 20 + 5)
        self.assertEqual(calculate_level(20, 20), 1)
        # Boundary condition for green (schedule_speed > 20 + 5)
        self.assertEqual(calculate_level(26, 20), 0)
        # Boundary condition for red (schedule_speed <= 20 - 5)
        self.assertEqual(calculate_level(14, 20), 2)

if __name__ == '__main__':
    unittest.main()
