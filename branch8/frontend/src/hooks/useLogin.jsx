import { useState } from "react";

export default function useLogin(url) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (object) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(object),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        setIsLoading(false);
        return;
      }

      // Storing both the user and token in localStorage
      localStorage.setItem("user", JSON.stringify(data)); // Store user details
      localStorage.setItem("token", data.token); // Store JWT token

      setIsLoading(false);
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
