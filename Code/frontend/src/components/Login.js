/**
 * Login Component
 *
 * This component renders a login/signup modal that allows users to log in or sign up.
 * It manages two modes: Login mode and Signup mode, and toggles between these based on user interaction.
 * On successful login or signup, it calls the relevant function (passed as a prop) and displays a success message using a toast notification.
 * In case of an error during login or signup, an error toast is shown with the error message.
 *
 * Instance Variables:
 * @state {string} userName - Stores the user's input for the username field.
 * @state {string} password - Stores the user's input for the password field.
 * @state {boolean} isLoginMode - Boolean that indicates whether the form is in login mode (true) or signup mode (false).
 * @const {function} toast - Function from Chakra UI's `useToast` hook to display toast notifications.
 *
 * Props:
 * @param {function} handleLogin - Function called when logging in with user-provided credentials.
 *                                 Expects parameters (userName: string, password: string) and returns a result object with a 'success' boolean.
 * @param {function} handleSignup - Function called when signing up with user-provided credentials.
 *                                  Expects parameters (userName: string, password: string) and returns a result object with a 'success' boolean.
 * @param {function} onClose - Function to close the modal on successful login/signup or on modal close.
 *
 * Functions:
 * @function handleUserName
 * @param {Event} e - The event triggered when the user types in the username input field.
 * @returns {void} - Updates `userName` state with the entered value.
 *
 * @function handlePassword
 * @param {Event} e - The event triggered when the user types in the password input field.
 * @returns {void} - Updates `password` state with the entered value.
 *
 * @function handleSubmit
 * @param {Event} e - The event triggered when the user submits the form by clicking the login/signup button.
 * @returns {Promise<void>} - Sends login/signup request based on `isLoginMode`, displays toast notification, resets form fields,
 *                            and closes the modal on success; shows error toast on failure.
 *
 * @function toggleMode
 * @returns {void} - Toggles the form between login and signup modes, and resets the `userName` and `password` fields.
 *
 * Rendered Output:
 * Returns a JSX element representing the login/signup modal, including fields for username and password,
 * a toggle link to switch modes, and a submit button. The form is disabled if either the username or password field is empty.
 */

import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button,
  Text,
  Link,
  useToast,
} from "@chakra-ui/react";

const Login = (props) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const toast = useToast();

  const handleUserName = (e) => setUserName(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let result;
      if (isLoginMode) {
        // Call the login function passed as a prop
        result = await props.handleLogin(userName, password);
      } else {
        // Call the signup function passed as a prop
        result = await props.handleSignup(userName, password);
      }

      // Check the result of login/signup
      if (result.success) {
        toast({
          title: isLoginMode ? "Login successful" : "Signup successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // Optionally reset the form or perform other actions
        setUserName("");
        setPassword("");
        props.onClose(); // Close modal on successful login/signup
      } else {
        toast({
          title: "Error",
          description: result.message || "An unexpected error occurred.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: isLoginMode ? "Login successful" : "Signup successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    // Reset fields when toggling
    setUserName("");
    setPassword("");
  };

  return (
    <>
      <Modal isOpen={true} onClose={props.onClose}>
        {" "}
        {/* Pass onClose prop */}
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isLoginMode ? "LOG IN" : "SIGN UP"}</ModalHeader>
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>User Name</FormLabel>
              <Input
                onChange={handleUserName}
                placeholder='User name'
                value={userName}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Password</FormLabel>
              <Input
                type='password'
                onChange={handlePassword}
                placeholder='Password'
                value={password}
              />
            </FormControl>

            <Text mt={4} fontSize='sm'>
              {isLoginMode ? (
                <>
                  New user?{" "}
                  <Link color='blue.500' onClick={toggleMode}>
                    Sign Up here
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link color='blue.500' onClick={toggleMode}>
                    Log in here
                  </Link>
                </>
              )}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={handleSubmit}
              colorScheme='blue'
              mr={3}
              disabled={!userName || !password}
            >
              {isLoginMode ? "Login" : "Sign up"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Login;
