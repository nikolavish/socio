export default (rules, fields) => {
  let errors = {};
  let validation = rules.validate(fields, { abortEarly: false });
  if (validation.error) {
    for (let err of validation.error.details) {
      errors[err.context.key] = err.type;
    }
    return { errors, canSubmit: false };
  }
  return { errors, canSubmit: true };
};
