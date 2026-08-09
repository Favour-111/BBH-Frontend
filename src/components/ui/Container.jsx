import clsx from "clsx";

export default function Container({ children, className }) {
  return <div className={clsx("mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12", className)}>{children}</div>;
}
