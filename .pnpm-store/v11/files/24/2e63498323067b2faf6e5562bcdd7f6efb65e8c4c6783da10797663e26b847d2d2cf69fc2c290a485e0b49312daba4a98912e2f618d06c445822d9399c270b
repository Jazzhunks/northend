import CollapsibleSection_default from "../../../components/layout/CollapsibleSection.vue.js";
import { createBlock, createCommentVNode, createElementBlock, createElementVNode, createSlots, createTextVNode, createVNode, defineComponent, nextTick, onBeforeUnmount, openBlock, ref, toDisplayString, unref, watch, withCtx } from "vue";
import { ScalarButton } from "@scalar/components/button";
import { ScalarLoading, useLoadingState } from "@scalar/components/loading";
//#region src/v2/blocks/response-block/components/ResponseBodyStreaming.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "flex w-full items-center justify-between" };
var _hoisted_2 = {
	key: 0,
	class: "mr-2 flex items-center gap-2"
};
var _hoisted_3 = {
	key: 0,
	class: "text-red bg-b-danger sticky top-0 border-b p-2"
};
var _hoisted_4 = {
	key: 1,
	class: "p-2"
};
var ResponseBodyStreaming_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ResponseBodyStreaming",
	props: { reader: {} },
	setup(__props) {
		const loader = useLoadingState();
		const textContent = ref("");
		const errorRef = ref(null);
		const contentContainer = ref(null);
		/** Track the current reader to prevent race conditions when reader changes */
		const currentReader = ref(null);
		/** Current decoder instance - reset for each new stream to prevent buffer corruption */
		const decoder = ref(null);
		/**
		* Scrolls the content container to the bottom
		*/
		const scrollToBottom = () => {
			if (contentContainer.value) contentContainer.value.scrollTop = contentContainer.value.scrollHeight;
		};
		watch(textContent, async () => {
			await nextTick(scrollToBottom);
		});
		/**
		* Reads the stream and appends the content
		*/
		async function readStream(streamReader) {
			try {
				while (loader.isLoading && currentReader.value === streamReader) {
					const { done, value } = await streamReader.read();
					if (currentReader.value !== streamReader) break;
					if (done) {
						loader.clear();
						break;
					}
					if (value && decoder.value) textContent.value += decoder.value.decode(value, { stream: true });
				}
			} catch (error) {
				if (currentReader.value === streamReader) {
					console.error("Error reading stream:", error);
					loader.clear();
					errorRef.value = error;
				}
			} finally {
				if (currentReader.value === streamReader && decoder.value) textContent.value += decoder.value.decode();
			}
		}
		const startStreaming = () => {
			if (currentReader.value) currentReader.value.cancel();
			currentReader.value = __props.reader;
			decoder.value = new TextDecoder();
			loader.start();
			textContent.value = "";
			errorRef.value = null;
			readStream(__props.reader);
		};
		const stopStreaming = () => {
			if (currentReader.value) {
				currentReader.value.cancel();
				currentReader.value = null;
			}
			loader.clear();
		};
		watch(() => __props.reader, startStreaming, { immediate: true });
		onBeforeUnmount(stopStreaming);
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(CollapsibleSection_default), { class: "max-h-content overflow-y-hidden" }, createSlots({
				title: withCtx(() => [createElementVNode("div", _hoisted_1, [_cache[1] || (_cache[1] = createElementVNode("div", null, "Body", -1)), unref(loader).isLoading ? (openBlock(), createElementBlock("div", _hoisted_2, [createVNode(unref(ScalarLoading), {
					loadingState: unref(loader),
					size: "xs"
				}, null, 8, ["loadingState"]), _cache[0] || (_cache[0] = createElementVNode("span", { class: "text-c-2" }, " Listening… ", -1))])) : createCommentVNode("", true)])]),
				default: withCtx(() => [createElementVNode("div", {
					ref_key: "contentContainer",
					ref: contentContainer,
					class: "text-xxs font-code h-full overflow-auto leading-6 whitespace-pre-wrap"
				}, [errorRef.value ? (openBlock(), createElementBlock("div", _hoisted_3, toDisplayString(errorRef.value.message), 1)) : createCommentVNode("", true), textContent.value ? (openBlock(), createElementBlock("div", _hoisted_4, toDisplayString(textContent.value), 1)) : createCommentVNode("", true)], 512)]),
				_: 2
			}, [unref(loader).isLoading ? {
				name: "actions",
				fn: withCtx(() => [createVNode(unref(ScalarButton), {
					size: "sm",
					variant: "ghost",
					onClick: stopStreaming
				}, {
					default: withCtx(() => [..._cache[2] || (_cache[2] = [createTextVNode(" Cancel ", -1)])]),
					_: 1
				})]),
				key: "0"
			} : void 0]), 1024);
		};
	}
});
//#endregion
export { ResponseBodyStreaming_vue_vue_type_script_setup_true_lang_default as default };

//# sourceMappingURL=ResponseBodyStreaming.vue.script.js.map