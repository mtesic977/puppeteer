async function solvePuzzleCaptchaManually() {
  try {
    console.log("Captcha");

    await new Promise((resolve) => {
      console.log("Please solve the puzzle captcha manually.");
      console.log("Once solved, execution will continue.");
      process.stdin.once("data", () => resolve());
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function automateProcessWithCaptcha(page) {
  try {
    // Check if a puzzle captcha is present
    const puzzleCaptchaDetected = await detectPuzzleCaptcha(page);
    if (puzzleCaptchaDetected) {
      console.log(
        "Puzzle captcha detected. Pausing execution for manual intervention..."
      );
      await solvePuzzleCaptchaManually();
    } else {
      console.log(
        "No puzzle captcha detected. Continuing with automation process..."
      );
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function detectPuzzleCaptcha(page) {
  try {
    const frame = page
      .frames()
      .find((frame) => frame.url().includes("captcha-delivery.com"));
    if (!frame) {
      return false;
    }

    const captchaDetected = await frame.evaluate(() => {
      return document.querySelector(".captcha") !== null;
    });

    console.log(captchaDetected);

    return captchaDetected;
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

module.exports = {
  automateProcessWithCaptcha,
};
