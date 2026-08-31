"use client";
import { createApiReference } from "@scalar/api-reference";
import { useEffect, useRef, useState } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/vue-bundler-flags.ts
globalThis.__VUE_OPTIONS_API__ = true;
globalThis.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = true;
globalThis.__VUE_PROD_DEVTOOLS__ = false;
//#endregion
//#region src/ApiReferenceReact.tsx
/**
* React wrapper around the Scalar API Reference
*/
var ApiReferenceReact = (props) => {
	const el = useRef(null);
	const [reference, setReference] = useState(null);
	/** handle adding the integration to the config */
	const addIntegration = () => Array.isArray(props.configuration) ? props.configuration.map((c) => ({
		_integration: "react",
		...c
	})) : {
		_integration: "react",
		...props.configuration
	};
	useEffect(() => {
		if (!el.current) return reference?.app?.unmount;
		const instance = createApiReference(el.current, addIntegration());
		setReference(instance);
		return instance.destroy;
	}, [el]);
	useEffect(() => {
		reference?.updateConfiguration(addIntegration());
	}, [props.configuration, reference]);
	return /* @__PURE__ */ jsx("div", { ref: el });
};
//#endregion
export { ApiReferenceReact };

//# sourceMappingURL=index.js.map