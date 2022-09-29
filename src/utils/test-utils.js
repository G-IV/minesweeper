import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";

import { setupStore } from "../app/store";

export const renderWithProviders = (
    ui,
    {
        preloadedState = {},
        store = setupStore(preloadedState),
        ...renderOptions
    } = {}
) => {
    const Wrapper = ({children}) => {
        return <Provider store={store}>{children}</Provider>
    }
    return {store, ...render(ui, {wrapper: Wrapper, ...renderOptions})}
}