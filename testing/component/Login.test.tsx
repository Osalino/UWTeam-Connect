// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Login from "../../client/pages/Login";

// Mock useNavigate so we can assert redirects without a real router
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );
}

describe("Login component – rendering", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("displays the UWTeam Connect title", () => {
    renderLogin();
    expect(screen.getByText("UWTeam Connect")).toBeInTheDocument();
  });

  it("shows Login and Sign Up tabs", () => {
    renderLogin();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign Up" }),
    ).toBeInTheDocument();
  });

  it("shows Sign In button by default (login mode active)", () => {
    renderLogin();
    expect(
      screen.getByRole("button", { name: "Sign In" }),
    ).toBeInTheDocument();
  });

  it("shows username and password input fields", () => {
    renderLogin();
    expect(
      screen.getByPlaceholderText("Enter your username"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password"),
    ).toBeInTheDocument();
  });
});

describe("Login component – tab switching", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("switches to Create Account button when Sign Up tab is clicked", async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.click(screen.getByRole("button", { name: "Sign Up" }));
    expect(
      screen.getByRole("button", { name: "Create Account" }),
    ).toBeInTheDocument();
  });

  it("switches back to Sign In when Login tab is clicked", async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.click(screen.getByRole("button", { name: "Sign Up" }));
    await user.click(screen.getByRole("button", { name: "Login" }));
    expect(
      screen.getByRole("button", { name: "Sign In" }),
    ).toBeInTheDocument();
  });
});

describe("Login component – client-side validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("shows error when form is submitted empty", async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.click(screen.getByRole("button", { name: "Sign In" }));
    expect(
      await screen.findByText("Please fill in all fields"),
    ).toBeInTheDocument();
  });

  it("shows error when username is too short", async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.type(screen.getByPlaceholderText("Enter your username"), "ab");
    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "password123",
    );
    await user.click(screen.getByRole("button", { name: "Sign In" }));
    expect(
      await screen.findByText("Username must be at least 3 characters"),
    ).toBeInTheDocument();
  });

  it("shows error when password is too short", async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.type(
      screen.getByPlaceholderText("Enter your username"),
      "validuser",
    );
    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "123",
    );
    await user.click(screen.getByRole("button", { name: "Sign In" }));
    expect(
      await screen.findByText("Password must be at least 6 characters"),
    ).toBeInTheDocument();
  });
});

describe("Login component – form submission", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("calls /api/auth/login and redirects on success", async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: { id: 1, username: "testuser", role: "member" },
        token: "mock-jwt-token",
      }),
    } as Response);

    renderLogin();
    await user.type(
      screen.getByPlaceholderText("Enter your username"),
      "testuser",
    );
    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "password123",
    );
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/auth/login",
        expect.objectContaining({ method: "POST" }),
      );
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("stores token in localStorage after successful login", async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: { id: 1, username: "testuser", role: "member" },
        token: "my-test-token",
      }),
    } as Response);

    renderLogin();
    await user.type(
      screen.getByPlaceholderText("Enter your username"),
      "testuser",
    );
    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "password123",
    );
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("my-test-token");
    });
  });

  it("displays server error message on failed login", async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid username or password" }),
    } as Response);

    renderLogin();
    await user.type(
      screen.getByPlaceholderText("Enter your username"),
      "wronguser",
    );
    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "wrongpass",
    );
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    expect(
      await screen.findByText("Invalid username or password"),
    ).toBeInTheDocument();
  });

  it("calls /api/auth/signup when in sign up mode", async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: { id: 2, username: "newuser", role: "member" },
        token: "new-user-token",
      }),
    } as Response);

    renderLogin();
    await user.click(screen.getByRole("button", { name: "Sign Up" }));
    await user.type(
      screen.getByPlaceholderText("Enter your username"),
      "newuser",
    );
    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "securepass",
    );
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/auth/signup",
        expect.objectContaining({ method: "POST" }),
      );
    });
  });
});
