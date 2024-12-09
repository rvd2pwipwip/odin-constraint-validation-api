/*
Clicking the submit button validates all the form groups of the passed form element by creating an array of all the form groups where each group will be validated separately by checking if its input has any of a list of validation options and evaluate its value's validity to display either a success icon or an error message and icon.
*/

const validateForm = (formSelector) => {
  // get the element with the passed query selector
  const formElement = document.querySelector(formSelector);

  // list of validation options as objects
  // only inputs with attribute value will check for validity
  const validationOptions = [
    {
      attribute: 'customMaxlength',
      isValid: (input) =>
        input.value &&
        input.value.trim().length <=
          parseInt(input.getAttribute('customMaxlength'), 10), // custom attribute needs .getAttribute!
      errorMessage: (input, label) =>
        `${label.textContent} needs to be less than ${input.getAttribute(
          'customMaxlength'
        )} characters.`,
    },
    {
      attribute: 'minlength',
      isValid: (input) =>
        input.value &&
        input.value.trim().length >= parseInt(input.minLength, 10), // js = camelCase = minLength!
      errorMessage: (input, label) =>
        `${label.textContent} needs to be at least ${input.minLength} characters.`,
    },
    {
      attribute: 'pattern',
      isValid: (input) => {
        const regExPattern = new RegExp(input.pattern);
        return regExPattern.test(input.value);
      },
      errorMessage: (input, label) => `Not a valid ${label.textContent}.`,
    },
    {
      attribute: 'match',
      isValid: (input) => {
        const matchSelector = input.getAttribute('match');
        const matchedElement = formElement.querySelector(`#${matchSelector}`);
        return (
          matchedElement && matchedElement.value.trim() === input.value.trim()
        );
      },
      errorMessage: (input, label) => {
        // get value of input match attribute
        const matchSelector = input.getAttribute('match');
        // get matched element with id = input match value
        const matchedElement = formElement.querySelector(`#${matchSelector}`);
        const matchedLabel =
          matchedElement.parentElement.parentElement.querySelector('label');
        return `${label.textContent} must be the same as ${matchedLabel.textContent}`;
      },
    },
    {
      attribute: 'required',
      // evaluate validity of passed input's value
      isValid: (input) => input.value.trim() !== '', // empty value is false
      // set message text for failed validation of passed input based on its label
      errorMessage: (input, label) => `${label.textContent} is required.`,
    },
  ];

  const validateSingleFormGroup = (formGroup) => {
    // get reference to each element of passed form group
    const label = formGroup.querySelector('label');
    const input = formGroup.querySelector('input, textarea');
    const errorContainer = formGroup.querySelector('.error');
    const errorIcon = formGroup.querySelector('.error-icon');
    const successIcon = formGroup.querySelector('.success-icon');

    let formGroupError = false;
    // go through each validation option object
    for (const option of validationOptions) {
      // if form group's input has that validation option's attribute with an invalid value
      if (input.hasAttribute(option.attribute) && !option.isValid(input)) {
        formGroupError = true;
        // display this validation option's error message
        errorContainer.textContent = option.errorMessage(input, label);

        input.classList.add('border-red-700');
        input.classList.remove('border-green-700');
        // display this form group's error icon
        errorIcon.classList.remove('hidden');
        successIcon.classList.add('hidden');
      }
    }
    // if form group's input has that validation option's attribute with a valid value
    if (!formGroupError) {
      errorContainer.textContent = '';
      input.classList.remove('border-red-700');
      input.classList.add('border-green-700');
      errorIcon.classList.add('hidden');
      successIcon.classList.remove('hidden');
    }
  };

  // prevent default browser validation
  formElement.setAttribute('novalidate', '');

  let formSubmitted = false;
  formElement.addEventListener('submit', (e) => {
    e.preventDefault(); // prevent default browser submit
    formSubmitted = true;
    validateAllFormGroups(formElement);
  });

  formElement.addEventListener('input', (e) => {
    const formGroup = e.target.closest('.form-group');
    const input = formGroup.querySelector('input');
    console.log(input);
    // live validation if form was previously submitted or form group was blurred
    if (formSubmitted || formGroup.hasAttribute('blurred')) {
      validateSingleFormGroup(formGroup);
    }
    if (input.type === 'password') {
      const eyeIcon = formGroup.querySelector('.eye-icon');
      eyeIcon.classList.remove('hidden');
    }
  });

  [...formElement.elements].forEach((element) => {
    element.addEventListener('blur', (e) => {
      console.log('blurred!');
      const blurredGroup = e.target.closest('.form-group');
      blurredGroup.setAttribute('blurred', '');
      validateSingleFormGroup(blurredGroup);
    });
  });

  const validateAllFormGroups = (formToValidate) => {
    // spread all form group (label, input, error, icons) elements in an array
    const formGroups = [...formToValidate.querySelectorAll('.form-group')];
    // validate each form group in the form separately
    formGroups.forEach((formGroup) => {
      validateSingleFormGroup(formGroup);
    });
  };
};

validateForm('#registration-form');
