import loader from "../assets/loader.gif";

interface LoadingProps {
  text?: string;
  className?: string;
}

function Loading({ text = "loading", className = "" }: LoadingProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-10 text-center text-gray-400 ${className}`}
    >
      <img src={loader} className="w-20" />
      <p className="loading-text">{text}</p>
    </div>
  );
}

export default Loading;
