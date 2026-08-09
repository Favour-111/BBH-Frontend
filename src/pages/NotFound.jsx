import { Link } from "react-router-dom";
import Container from "../components/ui/Container.jsx";
import Button from "../components/ui/Button.jsx";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-8xl text-gold-soft">404</p>
      <h1 className="mt-4 font-display text-3xl text-ink">Page Not Found</h1>
      <p className="mt-3 max-w-sm text-sm text-ink-soft">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/" className="mt-8">
        <Button variant="primary">Back to Home</Button>
      </Link>
    </Container>
  );
}
