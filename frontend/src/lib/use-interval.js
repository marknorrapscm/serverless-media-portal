import { useEffect, useRef } from "react";

/**
 * Dan Abramov's solution to the useTimeout problem in React.
 * Taken from: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */

export default function useInterval(callback, delay) {
	const savedCallback = useRef();

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		function tick() {
			savedCallback.current();
		}
		if (delay !== null) {
			let id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
}