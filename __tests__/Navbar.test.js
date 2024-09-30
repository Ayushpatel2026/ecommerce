import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import Navbar from "../components/Navbar.jsx"; 
import { useStateContext } from "../context/StateContext.js"; 
import { AiOutlineShopping } from "react-icons/ai";

// Mock useStateContext to control state for tests
jest.mock("../context/StateContext", () => ({
  useStateContext: jest.fn(),
}));

describe("Navbar Component", () => {
  const mockSetShowCart = jest.fn();
  const mockLogoutUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders logo with link to homepage", () => {
    useStateContext.mockReturnValue({
      showCart: false,
      setShowCart: mockSetShowCart,
      totalQuantities: 0,
      user: null,
      logoutUser: mockLogoutUser,
    });

    render(<Navbar />);
    const logoLink = screen.getByRole('link', { name: /Headphones Store/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
  });

  test("shows login button when user is not logged in", () => {
    useStateContext.mockReturnValue({
      showCart: false,
      setShowCart: mockSetShowCart,
      totalQuantities: 0,
      user: null,
      logoutUser: mockLogoutUser,
    });

    render(<Navbar />);
    const loginLink = screen.getByRole('link', { name: /login/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  test("shows profile and logout buttons when user is logged in", () => {
    useStateContext.mockReturnValue({
      showCart: false,
      setShowCart: mockSetShowCart,
      totalQuantities: 0,
      user: { id: 1, name: "John Doe" },
      logoutUser: mockLogoutUser,
    });

    render(<Navbar />);
    const profileLink = screen.getByRole('link', { name: /Profile/i });
    const logoutLink = screen.getByRole('link', { name: /Logout/i });

    expect(profileLink).toBeInTheDocument();
    expect(profileLink).toHaveAttribute('href', '/user');
    expect(logoutLink).toBeInTheDocument();
    expect(logoutLink).toHaveAttribute('href', '/');
  });

  test("displays the cart with the correct quantity", () => {
    useStateContext.mockReturnValue({
      showCart: false,
      setShowCart: mockSetShowCart,
      totalQuantities: 3,
      user: null,
      logoutUser: mockLogoutUser,
    });

    render(<Navbar />);
    const cartQuantity = screen.getByText('3');
    expect(cartQuantity).toBeInTheDocument();
  });

  test("clicking on cart icon triggers setShowCart", () => {
    useStateContext.mockReturnValue({
      showCart: false,
      setShowCart: mockSetShowCart,
      totalQuantities: 2,
      user: null,
      logoutUser: mockLogoutUser,
    });

    render(<Navbar />);
    const cartIcon = screen.getByTestId('cart-icon');
    fireEvent.click(cartIcon);

    expect(mockSetShowCart).toHaveBeenCalledWith(true);
  });

  test("clicking on logout triggers logoutUser", () => {
    useStateContext.mockReturnValue({
      showCart: false,
      setShowCart: mockSetShowCart,
      totalQuantities: 0,
      user: { id: 1, name: "John Doe" },
      logoutUser: mockLogoutUser,
    });

    render(<Navbar />);
    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(logoutButton);

    expect(mockLogoutUser).toHaveBeenCalled();
  });
});
