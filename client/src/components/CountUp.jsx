import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

const CountUp = ({ from = 0, to, duration = 2, suffix = "" }) => {
    const nodeRef = useRef();
    const isInView = useInView(nodeRef, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView) {
            const node = nodeRef.current;
            const controls = animate(from, to, {
                duration: duration,
                ease: "easeOut",
                onUpdate(value) {
                    node.textContent = Math.floor(value) + suffix;
                }
            });
            return () => controls.stop();
        }
    }, [from, to, isInView, duration, suffix]);

    return <span ref={nodeRef}>{from}{suffix}</span>;
};

export default CountUp;
