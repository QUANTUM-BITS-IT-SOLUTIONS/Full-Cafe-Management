import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center px-4">
        <h1 className="mb-4 text-6xl sm:text-8xl font-bold text-gold-gradient">404</h1>
        <p className="mb-4 text-lg sm:text-xl text-muted-foreground">Oops! Page not found</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-vibe-purple text-white font-medium hover:bg-vibe-violet transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
