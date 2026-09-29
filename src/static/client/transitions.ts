type TransitionPreset = {
    initial: {
        x: number;
        y: number;
        opacity: number;
    }
    animate: {
        x: number,
        y: number,
        opacity: number,
    },
    transition: {
        delay: number;
    }
}

//universal delay for all animated components
const GLOBAL_DELAY: number = .2;

/**
 * @returns `framer-motion-components-props`
 * @method **SLIDE_VERTICALLY**
 * @method **SLIDE_HORIZONTALLY**
 * @argument **index** - number
 */
const TRANSITION_PRESETS: Record<string, (index: number) => TransitionPreset> = {
    SLIDE_HORIZONTALLY: (index: number) => ({
        initial: {
            opacity: 0,
            x: -32,
            y: 0,
        },
        animate: {
            x: 0,
            y: 0,
            opacity: 1
        },
        transition: {
            delay: index * GLOBAL_DELAY,
        }
    }),
    SLIDE_VERTICALLY: (index: number) => ({
        initial: {
            opacity: 0,
            x: 0,
            y: 32,
        },
        animate: {
            x: 0,
            y: 0,
            opacity: 1
        },
        transition: {
            delay: index * GLOBAL_DELAY,
        }
    })
}

export default TRANSITION_PRESETS;