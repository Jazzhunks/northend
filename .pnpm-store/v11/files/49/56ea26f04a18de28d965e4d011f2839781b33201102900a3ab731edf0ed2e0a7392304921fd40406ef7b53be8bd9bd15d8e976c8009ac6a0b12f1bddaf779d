import { computed, ref, toValue, watch } from "vue";
//#region src/components/ScalarFloating/useResizeWithTarget.ts
/**
* Resize a floating element to match a target element
*/
function useResizeWithTarget(target, opts = { enabled: ref(true) }) {
	const targetWidth = ref(0);
	const targetHeight = ref(0);
	const observer = ref();
	if (typeof ResizeObserver !== "undefined") observer.value = new ResizeObserver(([entry]) => {
		if (!entry) return;
		targetWidth.value = entry.borderBoxSize[0]?.inlineSize ?? 0;
		targetHeight.value = entry.borderBoxSize[0]?.blockSize ?? 0;
	});
	watch([() => toValue(opts.enabled), () => toValue(target)], ([enabled, element]) => {
		if (!element || !observer.value) return;
		if (enabled) observer.value.observe(element);
		else observer.value.disconnect();
	}, { immediate: true });
	return {
		width: computed(() => toValue(opts.enabled) ? `${targetWidth.value}px` : void 0),
		height: computed(() => toValue(opts.enabled) ? `${targetHeight.value}px` : void 0)
	};
}
//#endregion
export { useResizeWithTarget };

//# sourceMappingURL=useResizeWithTarget.js.map