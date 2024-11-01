| **Test Case ID** | **Test Case Description**                             | **Preconditions**                 | **Test Steps**                                                           | **Expected Result**                                            | **Actual Result**                                   | **Pass/Fail** |
| ---------------- | ----------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------- | --------------------------------------------------- | ------------- |
| TC-001           | Render the rating component                           | User is on the recipe detail page | 1. Load the `RateRecipe` component.                                      | The component renders with 5 stars and a rating button.        |                                                     | Pass          |
| TC-002           | Click on a star to set a rating                       | Component is rendered             | 1. Click on the 3rd star.                                                | The 3rd star and all stars before it are filled.               |                                                     | Pass          |
| TC-003           | Rate the recipe and verify the rating is sent         | User has selected a rating        | 1. Click the "Rate this Recipe" button after selecting a rating.         | A PATCH request is sent with the correct recipe ID and rating. |                                                     | Pass          |
| TC-004           | Display thank you message after rating                | User has rated the recipe         | 1. After rating, check if the thank you message is displayed.            | "Thank you for rating!" is shown.                              |                                                     | Pass          |
| TC-005           | Prevent multiple ratings for the same recipe          | User has already rated the recipe | 1. Attempt to rate the recipe again.                                     | Rating is not submitted; the thank you message persists.       | Users can rate as many number of times as they want | Fail          |
| TC-006           | Render empty stars before rating is selected          | Component is rendered             | 1. Load the `RateRecipe` component without any prior rating.             | All stars are empty initially.                                 |                                                     | Pass          |
| TC-007           | Clicking on a star updates the rating value           | Component is rendered             | 1. Click on the 1st star.                                                | The rating state updates to 1.                                 |                                                     | Pass          |
| TC-008           | Clicking on a star resets the rating correctly        | Rating is set to 3                | 1. Click on the 2nd star after rating 3.                                 | The rating state updates to 2.                                 |                                                     | Pass          |
| TC-009           | Ensure star images render correctly                   | Component is rendered             | 1. Inspect the star images when rated and unrated.                       | Filled and empty star images are rendered correctly.           |                                                     | Pass          |
| TC-010           | Verify button is disabled when rating is not selected | Component is rendered             | 1. Check the "Rate this Recipe" button state before any star is clicked. | The button should be disabled initially.                       | Can click on the button without rating also         | Fail          |