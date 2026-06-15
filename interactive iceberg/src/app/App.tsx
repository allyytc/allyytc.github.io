import { IceburgInteractive } from "./components/IceburgInteractive";

export default function App() {
  return (
    <div
      className="size-full flex items-center justify-center overflow-auto"
      style={{ background: "#0b0f16", minHeight: "100vh", padding: "32px 24px" }}
    >
      <IceburgInteractive />
    </div>
  );
}
