import { render } from "@testing-library/react";
import 'intersection-observer';
import App from "./App";

describe("App", () => {
  it("renders App component", async () => {
    const {container} = render(<App />);
    const internalContainer = container.getElementsByClassName('StreamLayerSDK')[0];
    console.log(internalContainer.innerHTML)

    expect(internalContainer).toBeDefined();
    expect(internalContainer.innerHTML).toEqual('wait');
  });
});