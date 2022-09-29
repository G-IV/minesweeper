import React from "react";
import { screen } from "@testing-library/react";

import { renderWithProviders } from '../../utils/test-utils'

import Display from "./display";

describe('<Display />', () => {
    it('renders with 3 digits props={{val: 14, max: 3}}', () => {
        const {container} = renderWithProviders(<Display props={{val: 14, max: 3}}/>)
        const digitQty = container.querySelectorAll('.digit').length
        expect(digitQty).toEqual(3)
    })
    it('renders with 0,1,4 props={{val: 14, max: 3}}', () => {
        const {container} = renderWithProviders(<Display props={{val: 14, max: 3}}/>)
        const digits = [...container.querySelectorAll('.digit')].map((div) => div.textContent)
        expect(digits).toEqual(['0', '1', '4'])
    })
})