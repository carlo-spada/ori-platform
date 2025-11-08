"""
Tests for the simple skill gap endpoint.
"""
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_skill_gap_basic():
    """Test basic skill gap calculation."""
    request_data = {
        "user_skills": ["Python", "JavaScript", "SQL"],
        "required_skills": ["Python", "JavaScript", "TypeScript", "Docker"]
    }

    response = client.post("/api/v1/skill-gap", json=request_data)

    assert response.status_code == 200
    data = response.json()

    assert "user_skills" in data
    assert "required_skills" in data
    assert "missing_skills" in data

    assert set(data["user_skills"]) == set(request_data["user_skills"])
    assert set(data["required_skills"]) == set(request_data["required_skills"])
    assert set(data["missing_skills"]) == {"TypeScript", "Docker"}


def test_skill_gap_no_missing():
    """Test when user has all required skills."""
    request_data = {
        "user_skills": ["Python", "JavaScript", "TypeScript", "Docker", "Kubernetes"],
        "required_skills": ["Python", "JavaScript", "TypeScript"]
    }

    response = client.post("/api/v1/skill-gap", json=request_data)

    assert response.status_code == 200
    data = response.json()

    assert data["missing_skills"] == []


def test_skill_gap_all_missing():
    """Test when user has none of the required skills."""
    request_data = {
        "user_skills": ["Python", "Django"],
        "required_skills": ["Java", "Spring Boot", "Kubernetes"]
    }

    response = client.post("/api/v1/skill-gap", json=request_data)

    assert response.status_code == 200
    data = response.json()

    assert set(data["missing_skills"]) == {"Java", "Spring Boot", "Kubernetes"}


def test_skill_gap_case_insensitive():
    """Test that skill comparison is case-insensitive."""
    request_data = {
        "user_skills": ["python", "javascript"],
        "required_skills": ["Python", "JavaScript", "TypeScript"]
    }

    response = client.post("/api/v1/skill-gap", json=request_data)

    assert response.status_code == 200
    data = response.json()

    # Should only be missing TypeScript (case-insensitive match for Python and JavaScript)
    assert data["missing_skills"] == ["TypeScript"]


def test_skill_gap_empty_user_skills():
    """Test when user has no skills."""
    request_data = {
        "user_skills": [],
        "required_skills": ["Python", "JavaScript", "TypeScript"]
    }

    response = client.post("/api/v1/skill-gap", json=request_data)

    assert response.status_code == 200
    data = response.json()

    assert set(data["missing_skills"]) == {"Python", "JavaScript", "TypeScript"}


def test_skill_gap_empty_required_skills():
    """Test when no skills are required."""
    request_data = {
        "user_skills": ["Python", "JavaScript"],
        "required_skills": []
    }

    response = client.post("/api/v1/skill-gap", json=request_data)

    assert response.status_code == 200
    data = response.json()

    assert data["missing_skills"] == []


def test_skill_gap_both_empty():
    """Test when both skill lists are empty."""
    request_data = {
        "user_skills": [],
        "required_skills": []
    }

    response = client.post("/api/v1/skill-gap", json=request_data)

    assert response.status_code == 200
    data = response.json()

    assert data["missing_skills"] == []


def test_skill_gap_whitespace_handling():
    """Test that skills with whitespace are handled correctly."""
    request_data = {
        "user_skills": ["  Python  ", "JavaScript"],
        "required_skills": ["Python", "  TypeScript  "]
    }

    response = client.post("/api/v1/skill-gap", json=request_data)

    assert response.status_code == 200
    data = response.json()

    # Whitespace should be stripped during comparison
    assert data["missing_skills"] == ["  TypeScript  "]  # Original casing preserved


def test_skill_gap_duplicate_handling():
    """Test handling of duplicate skills."""
    request_data = {
        "user_skills": ["Python", "Python", "JavaScript"],
        "required_skills": ["Python", "TypeScript", "TypeScript"]
    }

    response = client.post("/api/v1/skill-gap", json=request_data)

    assert response.status_code == 200
    data = response.json()

    # Duplicates should be handled gracefully
    assert "TypeScript" in data["missing_skills"]
    assert "Python" not in data["missing_skills"]


def test_skill_gap_sorted_output():
    """Test that missing skills are sorted alphabetically."""
    request_data = {
        "user_skills": ["Python"],
        "required_skills": ["Zend", "Angular", "MySQL", "Docker"]
    }

    response = client.post("/api/v1/skill-gap", json=request_data)

    assert response.status_code == 200
    data = response.json()

    # Missing skills should be sorted
    assert data["missing_skills"] == sorted(data["missing_skills"])
