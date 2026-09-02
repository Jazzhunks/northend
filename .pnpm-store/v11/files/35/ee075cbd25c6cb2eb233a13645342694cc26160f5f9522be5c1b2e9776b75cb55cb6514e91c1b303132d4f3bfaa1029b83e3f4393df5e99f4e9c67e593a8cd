import { ref } from "vue";
//#region src/v2/blocks/scalar-address-bar-block/hooks/use-loading-animation.ts
/**
* Constants for the loading animation behavior.
* These control how the progress bar animates during and after requests.
*/
var TICK_INTERVAL_MS = 20;
var MAX_PERCENTAGE = 100;
var MIN_PERCENTAGE = 0;
var ASYMPTOTIC_LIMIT = 15;
var ASYMPTOTIC_DIVISOR = 60;
var FINISH_ANIMATION_STEPS = 400 / TICK_INTERVAL_MS;
/**
* Manages the loading animation for the address bar.
*
* The animation has two phases:
* 1. While requesting: Animates asymptotically toward 85% to indicate ongoing work
* 2. After request completes: Animates linearly to 100% over 400ms for smooth completion
*
* This creates a natural feel where the bar does not instantly jump to 100%,
* making the loading experience more predictable and less jarring.
*
* @returns An object with methods to control the loading animation and the current percentage
*/
var useLoadingAnimation = () => {
	/** The current loading percentage from 100 (not started) to 0 (complete) */
	const percentage = ref(MAX_PERCENTAGE);
	/** Tracks how much percentage was remaining when the request completed */
	const remaining = ref(0);
	/** Indicates whether a request is currently in progress */
	const isRequesting = ref(false);
	/** The interval timer that drives the animation */
	const interval = ref();
	/**
	* Resets the animation state to initial values.
	* This is called when the animation completes.
	*/
	const resetAnimation = () => {
		clearInterval(interval.value);
		interval.value = void 0;
		percentage.value = MAX_PERCENTAGE;
		isRequesting.value = false;
	};
	/**
	* Advances the loading animation by one tick.
	* Uses different animation strategies based on whether a request is active.
	*/
	const load = () => {
		if (isRequesting.value) percentage.value -= (percentage.value - ASYMPTOTIC_LIMIT) / ASYMPTOTIC_DIVISOR;
		else percentage.value -= remaining.value / FINISH_ANIMATION_STEPS;
		if (percentage.value <= MIN_PERCENTAGE) resetAnimation();
	};
	/**
	* Starts the loading animation.
	* If called while the finishing animation is running, it switches back to requesting mode.
	* This handles the case where a new request starts before the previous animation completes.
	*/
	const startLoading = () => {
		if (interval.value) {
			isRequesting.value = true;
			return;
		}
		isRequesting.value = true;
		interval.value = setInterval(load, TICK_INTERVAL_MS);
	};
	/**
	* Marks the request as complete and begins the finish animation.
	* The animation will continue until it reaches 100% to provide visual feedback.
	*/
	const stopLoading = () => {
		remaining.value = percentage.value;
		isRequesting.value = false;
	};
	return {
		startLoading,
		stopLoading,
		percentage,
		isLoading: isRequesting
	};
};
//#endregion
export { useLoadingAnimation };

//# sourceMappingURL=use-loading-animation.js.map