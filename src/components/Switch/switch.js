import React, { useState } from "react";
// import { REGEXP_LOADERS } from "webpack/lib/ModuleFilenameHelpers";
import "./switch.css";

const Switch = (props) => {
	const {
		toggleForSale,
		piece,
		toggleStates,
		// getForSale,
		accounts,
		owners,
	} = props;
	const [isToggled, setIsToggled] = useState(toggleStates[piece]);
	const onToggle = () => {
		if (accounts === owners[piece]) {
			setIsToggled(!isToggled);
			toggleStates[piece] = !toggleStates[piece];
			toggleForSale(piece)
			// console.log(toggleStates);
		}
	};
	return (
		<>
			<label className="toggle-switch">
				<input
					type="checkbox"
					checked={isToggled}
					onChange={() => {
						onToggle();
					}}
				/>
				<span className="switch" />
			</label>
		</>
	);
};

export default Switch;
