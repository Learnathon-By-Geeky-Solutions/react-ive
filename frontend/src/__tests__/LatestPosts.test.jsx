import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import LatestTuitionPosts from "../components/LatestPosts";
import { AuthContext } from "../context/AuthContext";
import fetchMock from "jest-fetch-mock";
import { BrowserRouter as Router } from "react-router-dom";

// Mock toast to avoid showing errors in tests
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

// Mock PostCard so we don’t depend on its internals
jest.mock("../components/PostCard", () => ({ jobDetails, schedule, userInfo }) => (
  <div data-testid="postcard">{jobDetails.title}</div>
));

const mockPosts = [
  {
    _id: "1",
    name: "Math Tutor Needed",
    location: "Dhaka",
    medium: "English",
    salary: "10000",
    experience: 1,
    classtype: "Online",
    studentNum: 2,
    subject: [{ name: "Math" }],
    gender: "Any",
    deadline: "2025-04-30",
    days: "Sat-Mon",
    time: "Evening",
    duration: 2,
    userId: {
      _id: "user1",
      name: "Guardian A",
    },
    createdAt: "2025-04-10T12:00:00Z",
  },
  {
    _id: "2",
    name: "English Tutor Needed",
    location: "Chittagong",
    medium: "Bangla",
    salary: "8000",
    experience: 2,
    classtype: "Offline",
    studentNum: 1,
    subject: [{ name: "English" }],
    gender: "Female",
    deadline: "2025-05-01",
    days: "Sun-Tue",
    time: "Afternoon",
    duration: 1.5,
    userId: {
      _id: "user2",
      name: "Guardian B",
    },
    createdAt: "2025-04-12T15:30:00Z",
  },
];

const renderWithProviders = (authLoading = false) => {
  return render(
    <AuthContext.Provider value={{ loading: authLoading }}>
      <Router>
        <LatestTuitionPosts />
      </Router>
    </AuthContext.Provider>
  );
};

beforeEach(() => {
  fetchMock.resetMocks();
});

describe("LatestTuitionPosts Component", () => {
  test("does not render posts when authLoading is true", () => {
    renderWithProviders(true);
    expect(screen.queryByText(/Latest Tuition Posts/i)).not.toBeInTheDocument();
  });

  test("renders loading text initially", async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));
    renderWithProviders(false);
    expect(screen.getByText(/Loading posts/i)).toBeInTheDocument();
  });

  test("renders fetched posts", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockPosts));

    renderWithProviders(false);

    await waitFor(() => {
      expect(screen.getAllByTestId("postcard")).toHaveLength(2);
    });

    expect(screen.getByText("Latest Tuition Posts")).toBeInTheDocument();
    expect(screen.getByText(/See More/i)).toBeInTheDocument();
  });

  test("renders message when no posts are available", async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));

    renderWithProviders(false);

    await waitFor(() => {
      expect(
        screen.getByText(/No latest tuition posts available/i)
      ).toBeInTheDocument();
    });
  });

  test("renders error fallback if fetch fails", async () => {
    fetchMock.mockRejectOnce(new Error("API failed"));

    renderWithProviders(false);

    await waitFor(() => {
      expect(
        screen.getByText(/No latest tuition posts available/i)
      ).toBeInTheDocument();
    });
  });
});
