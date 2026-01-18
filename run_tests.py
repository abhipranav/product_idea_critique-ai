#!/usr/bin/env python3
"""
Test runner script for the JIRA Critique Tool
"""

import subprocess
import sys

def run_tests():
    """Run all tests using pytest"""
    try:
        result = subprocess.run([sys.executable, "-m", "pytest", "-v"],
                              capture_output=True, text=True)
        print("STDOUT:")
        print(result.stdout)
        if result.stderr:
            print("STDERR:")
            print(result.stderr)
        return result.returncode == 0
    except FileNotFoundError:
        print("Error: pytest not found. Please install with: pip install pytest")
        return False

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)