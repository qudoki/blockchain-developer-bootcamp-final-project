import React, { useState } from "react";
import "./switch.css";

const Switch = (props) => {
	const { toggleForSale } = props;
	const [isToggled, setIsToggled] = useState(true);
	const onToggle = () => {
		setIsToggled(!isToggled);
	};
	return (
		<>
			<label className="toggle-switch">
				<input type="checkbox" checked={isToggled} onChange={onToggle} />
				<span className="switch" />
			</label>
		</>
	);
};

export default Switch;
