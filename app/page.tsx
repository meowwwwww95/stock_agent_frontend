import LoginPage from "@/components/login-page"

export default function Home() {
  // Redirect to dashboard if already logged in
  // This would normally check for a session or token
  // const isLoggedIn = checkIfLoggedIn();
  // if (isLoggedIn) {
  //   redirect("/dashboard");
  // }

  return <LoginPage />
}

