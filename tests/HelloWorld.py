import unittest
from util.loader import loadJsonSchema

class Tests(unittest.TestCase):
    def test_1(self):
        loadJsonSchema("x")