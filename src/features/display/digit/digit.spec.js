import React from "react";
import { screen } from "@testing-library/react";

import { renderWithProviders } from '../../../utils/test-utils'

import Digit from "./digit";

describe('<Digit />', () => {
    it('renders with no digit if props are empty', () => {
        const {container} = renderWithProviders(<Digit props={{}}/>)
        let val = container.querySelector('div').textContent
        expect(val).toEqual('')
    })
    it('renders with 5 if props={{val: 5}}', () => {
        renderWithProviders(<Digit props={{val: 5}}/>)
        expect(screen.queryByText(/5/i)).toBeInTheDocument()
    })
})