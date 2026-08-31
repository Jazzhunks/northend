import { REFERENCE_LS_KEYS, safeLocalStorage } from "@scalar/helpers/object/local-storage";
import { AuthSchema } from "@scalar/workspace-store/entities/auth";
import { coerceValue } from "@scalar/workspace-store/schemas/typebox-coerce";
//#region src/helpers/storage.ts
var storage = safeLocalStorage();
/**
* Provides an interface to store and retrieve the selected client value
* in local storage.
*/
var clientStorage = () => {
	const key = REFERENCE_LS_KEYS.SELECTED_CLIENT;
	return {
		get: () => {
			return storage.getItem(key);
		},
		set: (value) => {
			storage.setItem(key, value);
		}
	};
};
/**
* Provides an interface to store and retrieve authentication scheme
* information in local storage, including both the available schemes and
* the user's selected schemes.
*/
var authStorage = () => {
	const getKey = (slug) => {
		return `${REFERENCE_LS_KEYS.AUTH}-${slug}`;
	};
	return {
		getAuth: (slug) => {
			return coerceValue(AuthSchema, JSON.parse(storage.getItem(getKey(slug)) ?? "{}"));
		},
		setAuth: (slug, value) => {
			storage.setItem(getKey(slug), JSON.stringify(value));
		}
	};
};
//#endregion
export { authStorage, clientStorage };

//# sourceMappingURL=storage.js.map