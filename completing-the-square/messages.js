/**
 * Completing the Square - Stage Messages
 *
 * Edit the text content for each step of the lesson here.
 * These messages appear in the lesson text area below the visualization.
 */

const MESSAGES = {
    // Step descriptions shown during each stage
    steps: {
        1: "Lets complete the square for this equation. We can think of the first two terms as being areas of a box.",

        2: "We can almost assemble them both into one box if we move them to the right positions.",

        3: "What's the area of the missing piece to complete the square?",

        4: "With this piece added, we've now completed the square!",

        5: "But we can't add area for free. To get back to our original equation, we subtract the new area we added."
    },

    // Interactive feedback messages
    feedback: {
        // Step 2: Drag and drop puzzle
        step2Instruction: "Click-and-drag to move rectangles. R to rotate.",
        step2Success: "Great positioning! This leaves a square gap.",

        // Step 3: Area input puzzle
        step3Success: (bHalfSquared) => `Correct! The missing piece has area (b/2)² = ${bHalfSquared}.`
    },

    // Button labels
    buttons: {
        continue: "Continue",
        complete: "Complete!"
    }
};
