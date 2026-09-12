import { readonly, ref } from "vue";
//#region src/hooks/use-file-dialog.ts
/**
* Simplified interface for opening a file picker dialog
* Derived from vueuse @see https://vueuse.org/useFileDialog
*/
function useFileDialog({ multiple, accept, onChange, onError } = {}) {
	const files = ref(null);
	let input;
	if (typeof document !== "undefined") {
		input = document.createElement("input");
		input.type = "file";
		input.onchange = (event) => {
			files.value = event.target.files;
			onChange?.(files.value);
		};
		input.onerror = () => onError?.();
		input.multiple = multiple;
		input.accept = accept;
	}
	const open = () => {
		if (!input) return onError?.();
		input.click();
	};
	return {
		files: readonly(files),
		open
	};
}
//#endregion
export { useFileDialog };

//# sourceMappingURL=use-file-dialog.js.map